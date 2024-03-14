<template>
    <p>Trying to detect hate speech</p>
    <p>Your url: {{ url_name }}</p>
    <v-btn to="" variant="outlined" @click="getComments">Get Comment</v-btn>
    <p style="">display comments: {{ comment_des }}</p>
</template>



<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { getCurrentTab, url_name } from '../services/services'


const comment_des = ref('')

function testFunction() {
    console.log("test function")
}

const getComments = async () => {
    try{
        const response = await axios.get("http://localhost:8000/api/comments")
        comment_des = response.data.comment
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



</script>


<style>


</style>