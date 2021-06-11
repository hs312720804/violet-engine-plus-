import { createApp } from 'vue'
import installElementPlus from './plugins/element'

import adminToolkitPlus from '../node_modules/admin-toolkit-plus/dist/admin-toolkit-plus.es.js'
import '../node_modules/admin-toolkit-plus/dist/style.css'
import '@/assets/global.styl'


import App from './App.vue'
import { store, key } from '@/store'
import router from '@/router/index'
import i18n from '@/i18n'

// import { use } from 'element-plus/lib/locale'
// import './auth'

const app = createApp(App)

installElementPlus(app)
app.use(store, key).use(router).use(adminToolkitPlus).use(i18n).mount('#app')
