import { createApp } from 'vue'
import installElementPlus from './plugins/element'
import App from './App.vue'
// import adminToolkitPlus from 'admin-toolkit-plus'
// import '../node_modules/admin-toolkit-plus/dist/style.css'
import router from './router/index'

const app = createApp(App)
installElementPlus(app)
app.use(router).mount('#app')
