<template>
    <p>Trying to detect hate speech</p>
    <p>Your url: {{ url_name1 }}</p>
    <p>Tab url: {{  tabUrl }}</p>
    <p>Tab url from services: {{ url_name }}</p>
    <p>Loaded: {{ tabLoaded }}</p>
    <!-- <v-btn to="" variant="outlined" @click="getComments">Get Comment</v-btn> -->
    <!-- <p style="">display comments:</p> -->
    <!-- <div> {{  comment_des }}</div> -->

    <li>
        <v-row><p>Hello whats your daily routine like?</p></v-row>
        <v-row><p>you suck go fly a kite</p></v-row>
        <v-row><p>Hello how do you do sir?</p></v-row>
        <v-row><p>Fuck you, you a piece of shit. my grandmother can swear better than you!</p></v-row>
    </li>

    <p>Displaying the latest 5 comments</p>
    <ul>
        <li v-for="(comment, index) in comment_des" :key="index">{{ comment }}</li>
    </ul>

    <!-- receiving the message from background.js here -->
    <div>{{ receivedMessage }}</div>
</template>



<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { getCurrentTab, url_name, getExampleTabAsync, tabLoaded } from '../services/services'
import { createWatchCompilerHost } from 'typescript'
// import { refTag } from '../../public/background'


const comment_des = ref([])
const counterSpeechPrompt = ref('')
// console.log(refTag.value)
const receivedMessage = ref('')
// const tabLoaded = ref('')
const tabUrl = ref('')
// const url_name = ref('')
const url_name1 = ref('')

function testFunction() {
    console.log("test function")
}

const getComments = async () => {
    try{
        const response = await axios.get("http://localhost:8000/api/comments")
        comment_des.value = response.data.comment
        console.log(comment_des)
    }
    catch(error) {
        console.log(error)
    }
}

// const isYoutube = computed(() => {
//     if(url_name === "https://www.youtube.com") {
//         // write function to start web scraper. trigger function
//         getComments().then(() => {
//             console.log("done")
//         })
//     } else {
//         console.log("couldnt connect to server")
//     }
// })


async function getCurrentTabAsyncFromComponent() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError))
                // tabLoaded.value = "loaded"
            } else {
                resolve(tabs.length > 0 ? tabs[0].url : '')
                // tabLoaded.value = "not loaded"
            }
        })
    })
}


// chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
//         if (tabs.length > 0) {
//             url_name1.value = tabs[0].url
//             return url_name1    
//         }
// })



// async function getExampleTabAsync() {
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     if (changeInfo.status === 'complete' && tab.url.includes("http://www.example.com")) {
//       console.log("Tab updated and loaded: " + tab.url)
//       tabLoaded.value = "loaded"
//       return tabLoaded
//     }
//     else {
//         tabLoaded.value = "not loaded"
//         return tabLoaded
//     }
// })
// }


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


function handleMessage(message, sender, sendResponse) {
    if(message.action === "updateComments") {
        comment_des.value = message.comments
    }

}


onMounted(async () => {

    // trying to see whether you see loaded or not for example.com
    tabUrl.value = await getCurrentTabAsyncFromComponent()
    await getCurrentTabAsyncFromComponent()

    const checkTabURL = (tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete' && tab.url.includes("http://www.example.com")) {
            console.log("Tab updated and loaded: " + tab.url);
            tabLoaded.value = "loaded"; // This updates the reactive property directly
        } else {
            tabLoaded.value = "not loaded";
        }
    };

    chrome.tabs.onUpdated.addListener(checkTabURL);

    // // getting "hello" here
    // chrome.runtime.onMessage.addListener((request, sender, sendReponse) => {
    //     if(request.action === "useTabsAPI") {
    //         receivedMessage.value = request.data.message
    //         return receivedMessage

    //     }
    // })

    try {
        const status = await getExampleTabAsync();
        console.log("Tab load status:", status);
    } catch (error) {
        console.error("Failed to load the tab:", error);
    }


    // url_name
    try {
        await getCurrentTab()
        console.log(url_name.value)
    } catch(error) {
        console.log(error)
    }
})

function messageListener(request, sender, sendResponse) {
    if(request.action === "useTabsAPI") {
        receivedMessage.value = request.data.message
    }
}

onMounted(() => {
    // chrome.runtime.onMessage.addListener(messageListener)
    chrome.runtime.onMessage.addListener(handleMessage)
})

onUnmounted(() => {
    // chrome.runtime.onMessage.removeListener(messageListener)
    chrome.runtime.onMessage.removeListener(handleMessage)

    // chrome.tabs.onUpdated.removeListener(checkTabURL);
})

</script>


<style>


</style>