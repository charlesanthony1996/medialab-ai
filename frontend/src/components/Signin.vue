<template>
    <br>
    <v-text>Email</v-text>
    <v-text-field type="text" label="email" v-model="email"></v-text-field>
    <v-text>Password</v-text>
    <v-text-field type="password" label="password" v-model="password"></v-text-field>
    <p v-if="errMsg">{{ errMsg }}</p>
    <v-btn variant="outlined" @click="signIn">Submit</v-btn>


</template>


<script setup>
import { ref } from 'vue'
import firebase from "firebase/compat/app"
import { useRouter } from 'vue-router'

const email = ref("")
const password = ref("")
const router = useRouter()
const errMsg = ref("")


const signIn = () => {
    firebase
    .auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .then((data) => {
        console.log("sucessfully logged in")
        router.push("/counterspeech")
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