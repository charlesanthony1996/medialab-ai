<template>
    <br>
    <!--<v-text>Name</v-text>-->
    <v-text-field type="text" label="Name" variant="outlined" prepend-inner-icon="mdi-account-outline"></v-text-field>

    <!--<v-text>Email</v-text>-->
    <v-text-field type="text" label="E-mail" v-model="email" variant="outlined"
        prepend-inner-icon="mdi-email-outline"></v-text-field>

    <!--<v-text>Password</v-text>-->
    <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
        label="Password" variant="outlined" v-model="password" prepend-inner-icon="mdi-lock-outline"
        @click:append-inner="visible = !visible"></v-text-field>

    <v-btn variant="outlined" @click="register">
        Register
    </v-btn>
</template>


<script setup>
import { ref, computed } from 'vue'
import firebase from "firebase/compat/app"
import { useRouter } from 'vue-router'
import '@mdi/font/css/materialdesignicons.min.css'

const email = ref("")
const password = ref("")
const router = useRouter()

const register = () => {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email.value, password.value)
        .then((data) => {
            console.log("succesfully registered")
            router.push("/hatespeech")
        })
        .catch(error => {
            console.log(error.code)
            // alert(error.message)
        })
}

const visible = ref(false)

</script>

<script>
export default {
    data: () => ({
        visible: false,
    })
}


</script>


<style scoped></style>