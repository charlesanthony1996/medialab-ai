import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import About from '../components/About.vue'
import HateSpeech from '../components/HateSpeech.vue'
import Signin from '../components/Signin.vue'
import Signup from '../components/Signup.vue'
import firebase from "firebase/compat/app"

const routes: Array<RouteRecordRaw> = [
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
router.beforeEach((to, _from, next) => {
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
