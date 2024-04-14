<template>
  <h1 style="font-size:15px;">Hate Speech Application</h1>
  <v-btn v-if="!isLoggedIn" style="width:100px;height:30px;" to="/signup" variant="outlined">Sign up</v-btn>
  <v-btn v-if="!isLoggedIn" style="width:100px;height:30px;" to="/signin" variant="outlined">Sign in</v-btn>
  <v-btn @click="signOut" style="width:100px;height:30px;" variant="outlined">Log out</v-btn>
  <v-btn style="width:200px;height:30px;font-size:15px;" to="/hatespeech" variant="outlined">Continue as a guest</v-btn>
  <v-btn @click="getGreeting()">Greeting</v-btn>

  <div id="output">{{ outputMessage }}</div> -->

  <router-view></router-view>
  <br>
  <p v-if="analysisResult">analysisResult: {{ analysisResult }}</p>
</template>



<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import firebase from 'firebase/compat/app'
import "firebase/compat/firestore"
import "firebase/compat/auth"


const display = ref('')
const analysisResult = ref('')
// const outputMessage = ref('')
const isLoggedIn = ref(false)
const router = useRouter()
const greeting = ref("")

async function getGreeting() {
  try {
    const response = await axios.get("http://localhost:8000/api/show_greeting")
    greeting.value = response.data.greeting
    console.log(response.data)
  } catch (error) {
    console.error("Failed to fetch greeting:", error);
    console.log(error)
  }
}


// firebase intialization code here
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    isLoggedIn.value = true
  } else {
    isLoggedIn.value = false
  }
})

// sign out function for firebase
const signOut = () => {
  firebase.auth().signOut()
  router.push('/')
}


// function to higlight selected text
function getSelectedText() {
  if(window.getSelection) {
    return window.getSelection().toString()
  } else if (document.selection && document.selection.type != "Control") {
    return document.selection.createRange().text
  }
  return ''
}

// after highlighted the text is sent to the backend to get a response from the openai api
async function updateDisplayWithSelectedText() {

const text = getSelectedText()
display.value = text

if (text.trim().length > 0) {
  axios.post('http://localhost:8000/api/filter', { text: text.trim() })
    .then((response) => {
      console.log("filter result: ", response.data)
      analysisResult.value = response.data.filtered_text

      if (response.data.filtered_text !== 'Is not HS') {
        
        // Reuse the existing 'text' variable, no need to get it again
        
        axios.post('http://localhost:8000/api/analyze_hate_speech', { text: text.trim() })
          .then((response) => {
            console.log("analysis result: ", response.data)
            analysisResult.value = response.data.counterSpeech || response.data.message || ''
          })
          .catch((error) => {
            console.error("Error sending text for analysis: ", error)
          })
        
        // analysisResult.value = response.data.filtered_text
      }
    })
    .catch((error) => {
      console.error("Error sending text for filtering: ", error)
    })
}
}



onMounted(() => {
  document.addEventListener('mouseup', updateDisplayWithSelectedText)
  document.addEventListener('keyup', updateDisplayWithSelectedText)
  
})

onUnmounted(() => {
  document.removeEventListener('mouseup', updateDisplayWithSelectedText)
  document.removeEventListener('keyup', updateDisplayWithSelectedText)
})

// function fetchData(): void {
//   const response: { message: string } = { message: 'This is the response message' }; 
//   chrome.runtime.sendMessage({data: response}, (response) => {
//     console.log(response);
//     outputMessage.value = response.message;
//   });
// }

// fetchData();

// setInterval(fetchData, 1000);
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
