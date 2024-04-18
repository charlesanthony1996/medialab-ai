<template>
  <div v-if="analysisResult" class="foggy"> <!-- Container with tinted background -->
    <v-card class="popup-card" title="Counter Speech">
      <v-card-text>
        {{ analysisResult }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Close Dialog</v-btn>
        <v-btn class="left-btn" text @click="copyToClipboard">Copy to Clipboard</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Props
const props = defineProps({
  analysisResult: String
});

// Methods
const closeDialog = () => {
  // Emitting an event upwards to parent component
  emit('close');
};

const copyToClipboard = () => {
  const textarea = document.createElement('textarea');
  textarea.value = props.analysisResult;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

</script>

<style scoped>
.popup-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
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
