<template>
<h1>Login to your account</h1>
<p><input type="text" placeholder="Email" v-model="email"></p>
<p><input type="password" placeholder="Password" v-model="password"></p>
<p v-if="errMsg">{{ errMsg }}</p>
<p><button @click="signIn">Submit</button></p>
</template>



<script setup>

import { ref } from "vue";
import firebase from "firebase/compat/app"
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const signIn = () => {
    firebase
    .auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .then((data) => {
        console.log("Succesfully logged in");
        router.push("/feed");
    })
    .catch(error => {
        switch(error.code) {
            case 'auth/invalid-email':
                errMsg.value = 'Invalid Email'
                break
            case 'auth/user-not-found':
                errMsg.value = 'No account with that email was found'
                break
            case 'auth/wrong-password':
                errMsg.value = 'Incorrect password'
                break
            default:
                errMsg.value = 'Email or password was incorrect'
                break
        };
    });
}

</script>