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
</template>



<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { url_name, isChromeExtension, getCurrentTab, handleMessage, handleMessageListener, comment_des } from '../services/services'



const counterSpeechPrompt = ref('')
const receivedMessage = ref('')
const tabUrl = ref('')






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

onMounted(async () => {

})

onMounted(async () => {
    await getCurrentTab()
    await handleMessageListener()
})


onMounted(() => {
    // chrome.runtime.onMessage.addListener(handleMessage)
    if(isChromeExtension()) {
        setupChromeListeners()
    }
})

onUnmounted(() => {
    // chrome.runtime.onMessage.removeListener(handleMessage)
    if(isChromeExtension()) {
        chrome.runtime.onMessage.removeListener(setupChromeListeners)
    }

    // handleMessageListener()
})

</script>


<style>


</style>