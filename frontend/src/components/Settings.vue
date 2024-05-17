<template>
    <v-container id="settingsTop">
        <div id="settingsBack">
            <v-btn  density="comfortable" variant="outlined" to="/hatespeech">
                <v-icon icon="mdi-arrow-left"></v-icon>
            </v-btn>
        </div>

        <v-text id="settingsTitle">Settings</v-text>

        <!-- <v-layout row wrap align-center>
        <d-flex>
        <v-text id="settingsTitle">Settings</v-text>
        </d-flex>
        </v-layout> -->
    </v-container>

    <v-spacer>  </v-spacer>

    <v-text>Response Types</v-text>

    <v-container >
        <v-select
            clearable
            chips
            label="Select"
            :items="['sarcastic', 'formal', 'humorous', 'intelligent']"
            variant="outlined"
            v-model="selectedResponseType"
        ></v-select>
    </v-container>

    <v-text>Filter Types</v-text>

    <v-container >
        <v-select
            label="Select"
            :items="['LLM', 'Filter']"
            variant="outlined"
        ></v-select>
    </v-container>

    <v-text>Dark Mode</v-text>

    <v-container id="Mode">
        <v-switch
        v-model="model"
        :label="`${model}`"
        false-value="off"
        true-value="on"
        ></v-switch>
    </v-container>

</template>


<script setup>
import { ref } from 'vue'
import firebase from "firebase/compat/app"
import { useRouter } from 'vue-router'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.min.css'
import axios from 'axios'

const sendRequest = async(userMessage) => {
    try {
        const response = await axios.post("/api/analyze_hate_speech", {
            text: userMessage,
            responseType: selectedResponseType.value
        })
        // console.log(response.data)
    } catch(error) {
        console.log(error)
    }
}

const model = ref('off')
const selectedResponseType = ref('')
</script>

<style scoped>
    #Mode {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #settingsTop{
        display: flex;
        padding-left: 0;
        padding-right: 0;
    }

    #settingsBack{
        align-items: flex-start;
    }

    #settingsTitle{
        font-size: large;
        padding-left: 26.7%;
    } 

</style>