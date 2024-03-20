<template>
  <div>
    <h1 style="font-size:15px; padding-bottom: 24px;">Hate Speech Application</h1>
    <div class="centered-buttons">
      
      <v-btn style="width:100px;height:30px; " to="/signup" variant="outlined" class="main-btn">Sign up</v-btn>
      <v-btn style="width:100px;height:30px;" to="/signin" variant="outlined" class="main-btn">Sign in</v-btn>
      <v-btn style="width:200px;height:30px;font-size:15px;" to="/hatespeech" variant="outlined" class="main-btn">Continue as a guest</v-btn>
    </div>
    <router-view></router-view>
    <div v-if="showDisplay" class="content-container">
      <p>Highlited Content:</p>
      <p class="display-content">{{ display }}</p>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const display = ref('')
const route = useRoute()

// function to select text
function getSelectedText() {
  if (window.getSelection) {
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

  if (text.trim().length > 0) {
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
  document.removeEventListener('mouseup', updateDisplayWithSelectedText)
  document.removeEventListener('keyup', updateDisplayWithSelectedText)
})

const showDisplay = computed(() => route.path === '/hatespeech')
</script>

<style scoped>
@media (prefers-color-scheme: light) {
  .main-btn { 
    border: none;
    margin: 8px;
  }
  .main-btn:after { 
    border: none;
    margin: 8px;
    background-color: rgb(154, 136, 177);
  }
}

.centered-buttons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-container {
  border: 2px solid rgb(54, 54, 54);
  padding: 32px;
  margin-top: 32px;
  border-radius: 7px;
}

.main-btn { 
    border: none;
    margin: 8px;
  }

.main-btn:after { 
border: none;
margin: 8px;
background-color: rgb(154, 136, 177);

}

.display-content {
  padding-top: 32px;
}

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
