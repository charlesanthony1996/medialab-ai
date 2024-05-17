<template>
  <!-- progress bar component -->
  <!-- <div> -->
    <!-- <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div> -->
  <div v-if="analysisResult" class="foggy">
    <v-card class="popup-card" title="Counter Speech">
      <span>fuck you</span>
      <v-card-text>
        {{ analysisResult }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-row justify="center">
          <v-col cols="4" class="d-flex justify-center">
            <v-btn text @click="closeDialog" style="font-size:12px;margin-left:10px;">Close Dialog</v-btn>
          </v-col>
          <v-col cols="4" class="d-flex justify-center">
            <v-btn @click="generateCounterSpeech" style="font-size:12px;">Refresh</v-btn>
          </v-col>
          <v-col cols="4" class="d-flex justify-center">
            <v-btn text @click="copyToClipboard" style="font-size:12px;">Copy</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
  <!-- </div> -->
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineEmits } from 'vue';
import axios from 'axios'

// const analysisResult = ref('')

const lastHighlightedText = ref('')
// const isPopupVisible = ref(false);
// const isLoading = ref(false)

// Props
const props = defineProps({
  analysisResult: String
});

const emit = defineEmits(['close'])

// Methods
const closeDialog = () => {
  // Emitting an event upwards to parent component
  // analysisResult.value = '';
  // isPopupVisible.value = false;
  // window.getSelection().removeAllRanges()
  lastHighlightedText.value = ''
  window.getSelection().removeAllRanges()
  emit('close')
  // window.getSelection().removeAllRanges()

};

const copyToClipboard = () => {
  const textarea = document.createElement('textarea');
  textarea.value = props.analysisResult;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

const generateCounterSpeech = async () => {
  if (lastHighlightedText.value.trim().length > 0) {
    // isLoading.value = true
    try {
      const response = await axios.post('http://localhost:8000/api/filter', { text: lastHighlightedText.value.trim() })
      console.log("filter result: ", response.data.filtered_text)
      analysisResult.value = response.data.filtered_text
    } catch (error) {
      console.error("Error sending text for filtering: ", error)
    } finally {
      console.log("end the loading boolean")
    }
  }
}

// Function to get selected text
function getSelectedText() {
  if (window.getSelection) {
    return window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    return document.selection.createRange().text;
  }
  return '';
}

async function updateDisplayWithSelectedText() {
  const text = getSelectedText()
  if (text.trim().length > 0) {
    lastHighlightedText.value = text

    generateCounterSpeech()
  }
}


// document.addEventListener('mouseup', getSelectedText);
// document.addEventListener('keyup', getSelectedText);


</script>

<style scoped>
.popup-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  min-width: 300px;
  min-height: 200px;
}

.foggy {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  z-index: 9998; /* Set z-index lower than the popup card */
}

.left-btn {
  align-self: flex-start; /* Align button to the start (left) of the container */
  margin-right: 10px; /* Add some margin to separate it from other buttons */
}
</style>