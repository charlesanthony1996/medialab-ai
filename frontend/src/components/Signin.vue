<template>
    <div class="input-area">
        <p style="padding-bottom: 24px; padding-top: 24px;"></p>
    
        <v-text-field label="Username or E-Mail" class="input-field"></v-text-field>
        
        <v-text-field label="Password" type="password" class="input-field"></v-text-field>
    </div>
</template>



<script setup>
import { ref } from 'vue'


</script>

<style scoped>
    .input-area {
        width: 350px;
    }


</style>