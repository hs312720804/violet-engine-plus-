import { createApp } from 'vue'
import installElementPlus from './plugins/element'

// import adminToolkitPlus from 'admin-toolkit-plus'
import '../node_modules/admin-toolkit-plus/dist/style.css'
import '@/assets/global.styl'


import App from './App.vue'
import { store, key } from '@/store'
import router from './router/index'
// import { use } from 'element-plus/lib/locale'
// import './auth'

const app = createApp(App)

installElementPlus(app)
app.use(store, key).use(router).mount('#app')
