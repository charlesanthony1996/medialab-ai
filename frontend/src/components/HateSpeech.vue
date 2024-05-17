<template>
    <!-- <p v-if="userName">Welcome, {{  userName }}</p> -->
    <v-btn variant="outlined" to="/settings">Settings</v-btn>
    <!-- <p>Trying to detect hate speech</p> -->
    <!-- <p>Tab url from services: {{ url_name }}</p> -->
    <br>
    <v-row style="display:flex;">
        <p style="border: 1px solid red;" variant="outlined" v-for="(comment, index) in comment_des" :key="index" @click="handleTestCommentClick(comment)">
            {{ index + 1 }}: {{ comment }}
        </p>
    </v-row>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <PopupCard v-if="isPopupVisible" :analysisResult="analysisResult" @close="closeDialog" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineEmits } from 'vue'
import PopupCard from './Popup.vue';
import axios from 'axios'
import { url_name, isChromeExtension, getCurrentTab, handleMessageListener, comment_des } from '../services/services'
import { useRoute } from 'vue-router'

const analysisResult = ref('')
const isPopupVisible = ref(false)
const isLoading = ref(false)
const emit = defineEmits(['close'])

const route = useRoute()
// const userName = ref(route.state.userName || '')

const handleTestCommentClick = (comment) => {
    console.log("Testing comment click:", comment);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "testInsertText",
            commentText: comment,
            testText: "Hello World"
        }, function(response) {
            console.log('Response from content script:', response);
        });
    });
};

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
            }
        } catch(error) {
            console.error("Error sending text for filtering: ", error)
        } finally {
            isLoading.value = false
        }
    }
}

const closeDialog = () => {
    isPopupVisible.value = false
    isLoading.value = false
    emit('close')
}

onMounted(async () => {
    // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //     if (message.action === "updateComments") {
    //         comment_des.value = [...message.comments];
    //         console.log("Comments updated: ", comment_des.value);
    //     }
    // });

    await getCurrentTab();
    await handleMessageListener();
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', handleTextSelection);

    if (isChromeExtension()) {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === "useTabsAPI") {
                receivedMessage.value = request.data.message;
                sendResponse({status: "Message received"});
            }
        });
    }
});

onUnmounted(() => {
    document.removeEventListener('mouseup', handleTextSelection);
    document.removeEventListener('keyup', handleTextSelection);

    if (isChromeExtension()) {
        chrome.runtime.onMessage.removeListener(setupChromeListeners);
    }
});
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
