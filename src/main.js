import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/style.css'
import vuetify from './plugins/vuetify'
import router from './router'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

createApp(App)
    .use(router)
    .use(vuetify)
    .mount('#app')
