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
            @change="saveSettings"
        ></v-select>
    </v-container>

    <v-text>Filter Types</v-text>

    <v-container >
        <v-select
            label="Select"
            :items="['LLM', 'Filter']"
            variant="outlined"
            v-model="selectedFilterType"
            @change="saveSettings"
        ></v-select>
    </v-container>

    <v-text>Dark Mode</v-text>

    <v-container id="Mode">
        <v-switch
        v-model="darkMode"
        :label="`${darkMode}`"
        false-value="off"
        true-value="on"
        @change="saveSettings"
        ></v-switch>
    </v-container>

</template>


<script setup>
import { ref, onMounted } from 'vue'
import firebase from "firebase/compat/app"
import { useRouter } from 'vue-router'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.min.css'
import axios from 'axios'

const selectedResponseType = ref('')
const selectedFilterType = ref('')
const darkMode = ref('off')
const router = useRouter()

const saveSettings = async() => {
    const settings = {
        responseType: selectedResponseType.value,
        filterType: selectedFilterType.value,
        darkMode: darkMode.value
    }

    // save settings to local storage
    localStorage.setItem("settings", JSON.stringify(settings))

    // if the user is signed in, save settings to the database
    const user = firebase.auth().currentUser
    if(user) {
        try {
            await axios.post("/api/save_settings", {
                userId: user.uid,
                settings
            })
        } catch(error) {
            console.log("failed to save the settings to the database: ", error)
        }
    }
}


const loadSettings = async() => {
    const user = firebase.auth().currentUser
    let settings = null

    if(user) {
        // load settings from the database
        try {
            const response = await axios.get("http://localhost:5001/api/load_settings", {
                params: { userId: user.uid }
            })
            settings = response.data.settings
        } catch(error) {
            console.log("failed to load settings from the database: ", error)
        }
    }

    if(!settings) {
        // load settings from the local database
        const storedSettings = localStorage.getItem("settings")
        settings = storedSettings ? JSON.parse(storedSettings): {}
    }

    selectedResponseType.value = settings.responseType || ''
    selectedFilterType.value = settings.filterType || ''
    darkMode.value = settings.darkMode || ''
}

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

onMounted(loadSettings)
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