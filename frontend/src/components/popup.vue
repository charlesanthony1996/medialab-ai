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

<script>
export default {
  props: {
    analysisResult: String
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    copyToClipboard() {
      // Create a temporary textarea element
      const textarea = document.createElement('textarea');
      // Set its value to the analysisResult
      textarea.value = this.analysisResult;
      // Append it to the document body
      document.body.appendChild(textarea);
      // Select its content
      textarea.select();
      // Copy the selected content to clipboard
      document.execCommand('copy');
      // Remove the temporary textarea element
      document.body.removeChild(textarea);
      }
  }
}
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
