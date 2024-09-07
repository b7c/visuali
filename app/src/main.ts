import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import { PrimeVueOptions } from './config/app'

import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faEdit,
  faBroom,
  faBell,
  faBellSlash,
} from '@fortawesome/free-solid-svg-icons'

library.add(faEdit, faBroom, faBell, faBellSlash)

const app = createApp(App)

app.component('fa-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, PrimeVueOptions)
app.directive('tooltip', Tooltip);

app.mount('#root')
