<template>
    <div>User info page</div>
    <h3>This page is protected.</h3>
</template>
  
<script setup>
  import { ref, computed, onBeforeUnmount} from 'vue'
  import axios from 'axios'
  import firebase from 'firebase/compat/app'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const authListener = firebase.auth().onAuthStateChanged(function (user) {
    if(!user) {
      alert("you must be logged in to see this")
      router.push("/")
    }
  })

  onBeforeUnmount(() => {
    authListener()
  })
</script>
  
<style scoped>

  
</style>
  