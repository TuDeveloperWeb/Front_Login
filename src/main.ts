// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify' 

const app = createApp(App)

app.use(router)
app.use(vuetify) 

const pinia = createPinia()
app.use(pinia)

app.mount('#app')