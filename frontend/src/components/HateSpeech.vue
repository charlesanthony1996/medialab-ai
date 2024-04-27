<template>
    <p>Trying to detect hate speech</p>
    <p>Tab url from services: {{ url_name }}</p>
    <br>
    <!-- <li>
        <v-row><p>Hello whats your daily routine like?</p></v-row>
        <v-row><p>you suck go fly a kite</p></v-row>
        <v-row><p>Hello how do you do sir?</p></v-row>
        <v-row><p>Fuck you, you a piece of shit. my grandmother can swear better than you!</p></v-row>
    </li> -->
    <v-row style="display:flex;">
        <p style="" variant="outlined" v-for="(comment, index) in comment_des" :key="index">{{ index + 1 }}:{{ comment }}</p>
    </v-row>
    <br>
    <span>Fuck you</span>
    <br>

    <!-- <p v-if="analysisResult == ''">{{ analysisResult }}</p> -->


    <!-- <PopupCard v-if="analysisResult !== 'No hate speech detected.'" :analysisResult="analysisResult" @close="closeDialog"/> -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <PopupCard v-if="isPopupVisible" :analysisResult="analysisResult" @close="closeDialog" />
</template>



<script setup>
import { ref, computed, onMounted, onUnmounted, defineEmits } from 'vue'
import PopupCard from './Popup.vue';
import axios from 'axios'
import { url_name, isChromeExtension, getCurrentTab, handleMessage, handleMessageListener, comment_des } from '../services/services'



const counterSpeechPrompt = ref('')
const receivedMessage = ref('')
const tabUrl = ref('')
const analysisResult = ref('')
const isPopupVisible = ref(false)
// for the progress bar
const isLoading = ref(false)


const emit = defineEmits(['close'])


// processing comments to the backend -> check server.py
async function sendCommentsToServer() {
    const comments = Array.from(document.querySelectorAll('v-row p')).map(p => p.innerText)
    console.log(comments)
    try {
        await axios.post('http://localhost:8000/api/process_comments', { comments })
        console.log("Comments sent succesfully")
    } catch(error) {
        console.error("Error sending comments to server: ", error)
    }
}


// this will only run in a chrome extension environment
function setupChromeListeners() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if(request.action === "useTabsAPI") {
            receivedMessage.value = request.data.message
            sendResponse({status: "Message received"})
        }
    })
}

// testing highlighting on hatespeech.vue and not on app.vue
// check for the response and the delay here. is it better?
const handleTextSelection = async() => {
    const selectedText = window.getSelection().toString().trim()
    if (selectedText) {
        isLoading.value = true
        try {
            const response = await axios.post("http://localhost:8000/api/filter", { text: selectedText })
            if (response.data.filtered_text !== "No hate speech detected.") {
                analysisResult.value = response.data.filtered_text
                isPopupVisible.value = response.data.filtered_text !== "No hate speech detected."
                console.log(analysisResult.value)

                // if (isPopupVisible.value) {
                //     if (window.getSelection) {
                //         window.getSelection().removeAllRanges()
                //     } else if (document.selection) {
                //         document.selection.empty()
                //     }
                // }
            }
        } catch(error) {
            console.error("Error sending text for filtering: ", error)
        } finally {
            isLoading.value = false
        }
    }
}

const closeDialog = () => {
    isPopupVisible.value = false // Hide the popup
    isLoading.value = false
    emit('close')
}

// onMounted(async () => {

// })

// onMounted(async () => {
    
// })

// document.addEventListener('mouseup', handleTextSelection);
// document.addEventListener('keyup', handleTextSelection);

onMounted(async () => {

    await getCurrentTab()
    await handleMessageListener()
    document.addEventListener('mouseup', handleTextSelection)
    document.addEventListener('keyup', handleTextSelection)

    if(isChromeExtension()) {
        setupChromeListeners()
    }
})

onUnmounted(() => {
    document.removeEventListener('mouseup', handleTextSelection)
    document.removeEventListener('keyup', handleTextSelection)

    if(isChromeExtension()) {
        chrome.runtime.onMessage.removeListener(setupChromeListeners)
    }
    // handleMessageListener()
})

</script>


<style scoped>

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.loading-spinner {
  border: 6px solid #f3f3f3;
  border-radius: 50%;
  border-top: 6px solid #3498db;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}


@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


</style>