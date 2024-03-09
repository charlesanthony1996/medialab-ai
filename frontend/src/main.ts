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


const pinia = createPinia()
const app = createApp(App)
// const router = VueRouter.createRouter()

const vuetify = createVuetify({
    components,
    directives,
  })
app.use(router)
app.use(vuetify)
app.use(pinia)
app.mount('#app')
// createApp(App).mount('#app')
