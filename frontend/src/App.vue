<template>
  <h1>Hate Speech Application</h1>

    <v-btn to="about" variant="outlined">About</v-btn>
    <v-btn to="" variant="outlined">Sign up</v-btn>
    <v-btn to="" variant="outlined">Sign in</v-btn>
  <router-view></router-view>

  <p>{{ display  }}</p>
</template>

<script setup lang="ts">
import About from './components/About.vue'
import { ref, onMounted, onUnmounted } from 'vue'

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
