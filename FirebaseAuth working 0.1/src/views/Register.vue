<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="registerWithEmail">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required><br><br>

      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required><br><br>

      <button type="submit">Register with Email</button>
    </form>
    <button @click="registerWithGoogle">Register with Google</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')

const registerWithEmail = () => {
  firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
    .then(() => {
      console.log('User registered successfully with email/password!')
      router.push('/')
    })
    .catch(error => console.error(error.message))
}

const registerWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider)
    .then(() => router.push('/'))
    .catch(error => console.error(error.message))
}
</script>
