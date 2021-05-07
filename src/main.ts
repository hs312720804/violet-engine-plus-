import { createApp } from 'vue'
import installElementPlus from './plugins/element'

import '@/assets/global.styl'

import App from './App.vue'
// import adminToolkitPlus from 'admin-toolkit-plus'
import '../node_modules/admin-toolkit-plus/dist/style.css'
import router from './router/index'
import { use } from 'element-plus/lib/locale'

const app = createApp(App)
installElementPlus(app)
app.use(router).mount('#app')
