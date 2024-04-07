import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { getFirestore } from "firebase/firestore"
import { collectionGroup, collection, getDocs, addDoc, doc , setDoc } from "firebase/firestore";
import { query, where, limit , orderBy } from "firebase/firestore"


var firebaseConfig = {

  apiKey: "AIzaSyDiIcHi0Axt97LP6ceoFpSK_LNVMDyeh7s",
  authDomain: "vue3-auth-for-log-in.firebaseapp.com",
  projectId: "vue3-auth-for-log-in",
  storageBucket: "vue3-auth-for-log-in.appspot.com",
  messagingSenderId: "843904798245",
  appId: "1:843904798245:web:5a52c059cc7c6033d8b9cc",
  measurementId: "G-JE5ZFFQXS3"
  
  };



firebase.initializeApp(firebaseConfig);

const app = createApp(App);

var database = getFirestore();

app.use(router)

app.mount('#app')

