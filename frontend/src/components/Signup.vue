<template>
    <v-text>Name</v-text>
    <v-text-field label="name" v-model="name"></v-text-field>
    <v-text>Email</v-text>
    <v-text-field label="email" v-model="email"></v-text-field>
    <v-text>Password</v-text>
    <v-text-field label="password" v-model="password"></v-text-field>
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