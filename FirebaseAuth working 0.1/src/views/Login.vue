<template>
  <div>
    <h1>Login</h1>
    <button @click="signInWithGoogle">Sign In with Google</button>
  </div>
</template>

<script setup>
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider)
    .then(() => router.push('/'))
    .catch(error => console.error(error.message))
}
</script>
