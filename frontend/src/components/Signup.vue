<template>
    <p>Sign up here</p>
    <v-text>Name</v-text>
    <v-text-field label="Name" v-model="name"></v-text-field>
    <v-text>Email</v-text>
    <v-text-field label="Email" v-model="email"></v-text-field>
    <v-text>Password</v-text>
    <v-text-field label="Password" v-model="password"></v-text-field>
</template>


<script>
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