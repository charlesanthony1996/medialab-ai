<template>
    <v-text>Username or email</v-text>
    <v-text-field label="Email"></v-text-field>
    <v-text>Password</v-text>
    <v-text-field label="Password"></v-text-field>
    <p v-if="errMsg">{{ errMsg }}</p>
    <button variant="outlined" @click="signIn">Submit</button>


</template>


<script setup>
import { ref } from 'vue'
import firebase from "firebase/compat/app"
import { useRouter } from 'vue-router'

const email = ref("")
const password = ref("")
const router = useRouter()


const signIn = () => {
    firebase
    .auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .then((data) => {
        console.log("sucessfully logged in")
        router.push("/hatespeech")
    })
    .catch(error => {
        switch(error.code) {
            case 'auth/invalid-email':
                errMsg.value = 'Invalid email'
                break
            case 'auth/user-not-found':
                errMsg.value = 'No account with that email was found'
                break
            case 'auth/wrong-password':
                errMsg.value = 'Incorrect password'
                break
            default:
                errMsg.value = 'Email or password is incorrect'
                break
        }
    })
}



</script>

<style scoped>

</style>