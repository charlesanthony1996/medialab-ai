import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import About from '../components/About.vue'
import HateSpeech from '../components/HateSpeech.vue'
import Signin from '../components/Signin.vue'
import Signup from '../components/Signup.vue'
import firebase from "firebase/compat/app"
import UserSettings from "../components/UserSettings.vue"
import Cookies from 'js-cookie'

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
  {
    path: '/usersettings',
    name: 'usersettings',
    component: UserSettings,
    meta: { guestOnly: true}
  }
//   { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// auth setup
router.beforeEach(async (to, _from, next) => {
  await firebase.auth().onAuthStateChanged(user => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const guestOnly = to.matched.some(record => record.meta.guestOnly);
    const isAuthenticated = user != null;
    const hasCookie = Cookies.get('myCookie');

    if (requiresAuth && !isAuthenticated) {
      next('/signin');
    } else if (guestOnly && isAuthenticated) {
      next('/hatespeech');
    } else {
      next();
    }
  });
});


// router.beforeEach((to, from, next) => {
// // 

// })

export default router
