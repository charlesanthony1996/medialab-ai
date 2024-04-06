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


const pinia = createPinia()
const app = createApp(App)
// const router = VueRouter.createRouter()

var firebaseConfig = {

  apiKey: "AIzaSyCCbLKyEsJjKrxDbAPNW_dO341ph1T7-iI",

  authDomain: "vue-firebase-automation-d374e.firebaseapp.com",

  projectId: "vue-firebase-automation-d374e",

  storageBucket: "vue-firebase-automation-d374e.appspot.com",

  messagingSenderId: "268727744532",

  appId: "1:268727744532:web:09be67565a89d6170b8f01"

};

// firebase initialization
firebase.initializeApp(firebaseConfig);

const vuetify = createVuetify({
    components,
    directives,
  })
app.use(router)
app.use(vuetify)
app.use(pinia)
app.mount('#app')
// createApp(App).mount('#app')
