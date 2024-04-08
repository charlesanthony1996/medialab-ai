import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import About from '../components/About.vue'
import HateSpeech from '../components/HateSpeech.vue'
import CounterSpeech from '../components/CounterSpeech.vue'
import Signin from '../components/Signin.vue'
import Signup from '../components/Signup.vue'
import firebase from "firebase/compat/app"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: function () {
      return import('../components/HelloWorld.vue')
    },
  },
  {
    path: '/about',
    name: 'about',
    // component: function () {
    //   return import('../components/About.vue')
    // },
    component: About
  },
  {
    path: '/hatespeech',
    name: 'hatespeech',
    component: HateSpeech
  },
  {
    path: '/counterspeech',
    name: 'counterspeech',
    component: CounterSpeech,
    meta: { requiresAuth: true }
  },
  {
    path: '/signin',
    name: 'signin',
    component: Signin,
    meta: { guestOnly: true}
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
    meta: { guestOnly: true}

  },
//   { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// auth setup
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const guestOnly = to.matched.some(record => record.meta.guestOnly)
  const isAuthenticated = firebase.auth().currentUser

  if(requiresAuth && !isAuthenticated) {
    next('/signin')
  } else if (isAuthenticated && guestOnly){
    next('/hatespeech')
  } else {
    next()
  }
})

// router.beforeEach((to, from, next) => {
// // 

// })

export default router
