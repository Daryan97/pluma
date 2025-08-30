import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

import './styles/index.css'
import 'highlight.js/styles/github.css'
import 'highlight.js/styles/github-dark.css'

const pinia = createPinia()

createApp(App)
    .use(router)
    .use(pinia)
    .use(Toast, {
        position: POSITION.TOP_RIGHT,
        timeout: 3000,
    }).mount('#app')
