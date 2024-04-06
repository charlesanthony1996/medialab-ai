<template>
    <v-text>Name</v-text>
    <v-text-field type="text" label="name"></v-text-field>
    <v-text>Email</v-text>
    <v-text-field type="text" label="email" v-model="email"></v-text-field>
    <v-text>Password</v-text>
    <v-text-field type="password" label="password" v-model="password"></v-text-field>
    <v-btn variant="outlined" @click="register">Register</v-btn>
</template>


<script setup>
import { ref, computed } from 'vue'
import firebase from "firebase/compat/app"
import { useRouter } from 'vue-router'

const email = ref("")
const password = ref("")
const router = useRouter()

const register = () => {
    firebase
    .auth()
    .createUserWithEmailAndPassword(email.value, password.value)
    .then((data) => {
        console.log("succesfully registered")
        router.push("/about")
    })
    .catch(error => {
        console.log(error.code)
        alert(error.message)
    })
}



</script>


<style scoped>


</style>