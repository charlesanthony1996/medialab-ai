import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import About from '../components/About.vue'

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
//   { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// router.beforeEach((to, from, next) => {
// // 

// })

export default router
