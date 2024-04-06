import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import { createRouter } from 'vue-router'
import router from './router'
// firebase stuff
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
// import { getAnalytics } from "firebase/analytics"


const pinia = createPinia()
const app = createApp(App)
// const router = VueRouter.createRouter()

var firebaseConfig = {

  apiKey: "AIzaSyAgVuqvT5RUTPJ4PS1oSBHTP8KeyafScVs",

  authDomain: "hate-speech-app.firebaseapp.com",

  projectId: "hate-speech-app",

  storageBucket: "hate-speech-app.appspot.com",

  messagingSenderId: "1025959232892",

  appId: "1:1025959232892:web:f90eaf50536a3fb00a50f9",

  measurementId: "G-BTD91QKYB4"

}

// firebase initialization
firebase.initializeApp(firebaseConfig)

const vuetify = createVuetify({
    components,
    directives,
  })
app.use(router)
app.use(vuetify)
app.use(pinia)
app.mount('#app')
// createApp(App).mount('#app')
