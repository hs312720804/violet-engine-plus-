import { createApp } from 'vue'
import installElementPlus from './plugins/element'
import adminToolkitPlus from '@ccprivate/admin-toolkit-plus'
import '../node_modules/@ccprivate/admin-toolkit-plus/dist/style.css'
import '@/assets/icon/iconfont.css'
import '@/assets/global.styl'
import '@/assets/animation/transition.css'


import App from './App.vue'
import { store, key } from '@/store'
import router from '@/router/index'
import i18n from '@/i18n'
import installDirective from '@/directive'
import JsonViewer from 'vue3-json-viewer'
// import CIcon from '@/components/CIcon.vue'

// import { use } from 'element-plus/lib/locale'
// import './auth'

const app = createApp(App)

installElementPlus(app)
installDirective(app)
app.use(store, key).use(router).use(adminToolkitPlus).use(i18n).use(JsonViewer).mount('#app')
// app.component('CIcon', CIcon)
