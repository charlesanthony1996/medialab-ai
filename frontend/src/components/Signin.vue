<template>
    <br>
    <!--<v-text>Email</v-text>-->
    <v-text-field type="text" label="E-mail" v-model="email" variant="outlined"
        prepend-inner-icon="mdi-email-outline"></v-text-field>

    <!--<v-text>Password</v-text>-->
    <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
        label="Password" variant="outlined" v-model="password" prepend-inner-icon="mdi-lock-outline"
        @click:append-inner="visible = !visible"></v-text-field>

    <p v-if="errMsg">{{ errMsg }}</p>
    <v-btn variant="outlined" @click="signIn">
        Submit
    </v-btn>
</template>


<script setup>
import { ref } from 'vue'
import firebase from "firebase/compat/app"
import { useRouter } from 'vue-router'
import '@mdi/font/css/materialdesignicons.min.css'
import Cookies from 'js-cookie'

const email = ref("")
const password = ref("")
const router = useRouter()
const errMsg = ref("")
const visible = ref(false)



const signIn = () => {
    firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then((data) => {
            console.log("sucessfully logged in")
            Cookies.set("myCookie", 'loggedIn', {expires: 7})
            router.push("/hatespeech")
        })
        .catch(error => {
            switch (error.code) {
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

function setCookie(name, value, days) {
    var expires = ""
    if (days) {
        var date = new Date()
        date.Date(date.getTime() + (days * 24 * 60 * 60 * 1000))
        expires = "; expires=" + date.toUTCString()
    }

    document.cookie = name + "=" + (value || "") + expires + "; path=/"
}

</script>

<script>
export default {
    data: () => ({
        visible: false,
    })
}


</script>

<style scoped></style>