<template>
    <p>Trying to detect hate speech</p>
    <!-- <p>Tab url from services: {{ url_name }}</p> -->
    <br>
    <li>
        <v-row><p>Hello whats your daily routine like?</p></v-row>
        <v-row><p>you suck go fly a kite</p></v-row>
        <v-row><p>Hello how do you do sir?</p></v-row>
        <v-row><p>Fuck you, you a piece of shit. my grandmother can swear better than you!</p></v-row>
    </li>

    <!-- <p>Displaying the latest 5 comments</p> -->
    <ul>
        <li v-for="(comment, index) in comment_des" :key="index">{{ comment }}</li>
    </ul>
    <div>{{ receivedMessage }}</div>
</template>



<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { getCurrentTab, url_name, getExampleTabAsync, tabLoaded, isChromeExtension } from '../services/services'
// import { createWatchCompilerHost } from 'typescript'


const comment_des = ref([])
const counterSpeechPrompt = ref('')
// console.log(refTag.value)
const receivedMessage = ref('')
// const tabLoaded = ref('')
const tabUrl = ref('')
// const url_name = ref('')
const url_name1 = ref('')

// function testFunction() {
//     console.log("test function")
// }

// const getComments = async () => {
//     try{
//         const response = await axios.get("http://localhost:8000/api/comments")
//         comment_des.value = response.data.comment
//         console.log(comment_des)
//     }
//     catch(error) {
//         console.log(error)
//     }
// }


// async function getCurrentTabAsyncFromComponent() {
//     return new Promise((resolve, reject) => {
//         chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
//             if (chrome.runtime.lastError) {
//                 reject(new Error(chrome.runtime.lastError))
//                 // tabLoaded.value = "loaded"
//             } else {
//                 resolve(tabs.length > 0 ? tabs[0].url : '')
//                 // tabLoaded.value = "not loaded"
//             }
//         })
//     })
// }


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

// function to handle the update comments action from content script.js
function handleMessage(message, sender, sendResponse) {
    if(message.action === "updateComments") {
        comment_des.value = message.comments
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

    // trying to see whether you see loaded or not for example.com
    // tabUrl.value = await getCurrentTabAsyncFromComponent()
    // await getCurrentTabAsyncFromComponent()

    // const checkTabURL = (tabId, changeInfo, tab) => {
    //     if (changeInfo.status === 'complete' && tab.url.includes("http://www.example.com")) {
    //         console.log("Tab updated and loaded: " + tab.url);
    //         tabLoaded.value = "loaded"; // This updates the reactive property directly
    //     } else {
    //         tabLoaded.value = "not loaded"
    //     }
    // }

    // chrome.tabs.onUpdated.addListener(checkTabURL)

    // try {
    //     const status = await getExampleTabAsync()
    //     console.log("Tab load status:", status)
    // } catch (error) {
    //     console.error("Failed to load the tab:", error)
    // }


    // url_name
    // try {
    //     await getCurrentTab()
    //     console.log(url_name.value)
    // } catch(error) {
    //     console.log(error)
    // }
})

// message listener to get the hello from contentscript.js
// displaying the value on the template is commented out for now
function messageListener(request, sender, sendResponse) {
    if(request.action === "useTabsAPI") {
        receivedMessage.value = request.data.message
    }
}

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
})

</script>


<style>


</style>