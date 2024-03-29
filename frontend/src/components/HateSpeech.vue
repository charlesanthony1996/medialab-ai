<template>
    <p>Trying to detect hate speech</p>
    <p>Your url: {{ url_name }}</p>
    <v-btn to="" variant="outlined" @click="getComments">Get Comment</v-btn>
    <p style="">display comments: {{ comment_des }}</p>

    <li>
        <v-row><p>Hello whats your daily routine like?</p></v-row>
        <v-row><p>you suck go fly a kite</p></v-row>
        <v-row><p>Hello how do you do sir?</p></v-row>
        <v-row><p>Fuck you, you a piece of shit. my grandmother can swear better than you!</p></v-row>
    </li>

    <p>Display comments</p>
    <ul>
        <li v-for="(comment, index) in comment_des" :key="index">{{ comment }}</li>

    </ul>
</template>



<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { getCurrentTab, url_name } from '../services/services'
// import '../../public/contentScript.js'
// import { observedComments } from '../../public/contentScript.js'
import { createWatchCompilerHost } from 'typescript'
import { refTag } from '../../public/background' 


const comment_des = ref([])
const counterSpeechPrompt = ref('')
console.log(refTag.value)

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

const isYoutube = computed(() => {
    if(url_name === "https://www.youtube.com") {
        // write function to start web scraper. trigger function
        getComments().then(() => {
            console.log("done")
        })

        
    } else {
        console.log("couldnt connect to server")
    }
})


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

// console.log(comments)
// onMounted(() => {
//     chrome.runtime.onMessage.addListener(handleMessage)
// })

// onUnmounted(() => {
//     chrome.runtime.onMessage.removeListener(handleMessage)
// })

onMounted(() => {
    if (window.chrome && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener(handleMessage)
    }
})

onUnmounted(() => {
    if (window.chrome && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.removeListener(handleMessage)
    }
})


function handleMessage(message, sender, sendResponse) {
    if(message.action === "updateComments") {
        comment_des.value = message.comments
    }

}

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(request);
//     sendResponse({farewell: "goodbye"});
//   }
// );


</script>


<style>


</style>