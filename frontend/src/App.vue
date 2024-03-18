<template>
  <h1 style="font-size:15px;">Hate Speech Application</h1>
    <v-btn style="width:100px;height:30px;" to="/signup" variant="outlined">Sign up</v-btn>
    <v-btn style="width:100px;height:30px;" to="/signin" variant="outlined">Sign in</v-btn>
    <v-btn style="width:200px;height:30px;font-size:15px;" to="/hatespeech" variant="outlined">Continue as a guest</v-btn>
  <router-view></router-view>

  <p>{{ display  }}</p>
  <p>{{  }}</p>
</template>

<script setup lang="ts">
// import About from './components/About.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const display = ref('')

// function to select text
function getSelectedText() {
  if(window.getSelection) {
    return window.getSelection().toString()
  } else if (document.selection && document.selection.type != "Control") {
    return document.selection.createRange().text
  }
  return ''
}

// update function for the selected text
function updateDisplayWithSelectedText() {
  const text = getSelectedText()
  display.value = text

  if(text.trim().length > 0) {
    axios.post('http://localhost:8000/api/analyze_text', { text: text.trim() })
    .then((response: { data: any }) => {
      console.log("analysis result: ", response.data)
    })
    .catch((error: any) => {
      console.error("Error sending text for analysis: ", error)
    })
  }
}

onMounted(() => {
  // listen for mouse events
  document.addEventListener('mouseup', updateDisplayWithSelectedText)

  document.addEventListener('keyup', updateDisplayWithSelectedText)

})


onUnmounted(() => {
  document.addEventListener('mouseup', updateDisplayWithSelectedText)

  document.addEventListener('keyup', updateDisplayWithSelectedText)
})

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
