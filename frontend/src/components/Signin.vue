<template>
   
   <br>
    <!--<v-text>Email</v-text>-->
    <v-text-field
        type="text" 
        label="E-mail" 
        v-model="email"
        variant="outlined"
    ></v-text-field>

    <!--<v-text>Password</v-text>-->
    <v-text-field 
        
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        label="Password"
        variant="outlined"
        v-model="password"
        @click:append-inner=" visible = !visible"
    ></v-text-field>

    <p v-if="errMsg">{{ errMsg }}</p>
    <v-btn 
        variant="outlined" 
        @click="signIn"
    >
        Submit
    </v-btn>
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

const visible = ref(false)

</script>

<script>
export default {
    data: () => ({
        visible:false,
    })
}


</script>

<style scoped>

</style>