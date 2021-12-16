import { App } from 'vue'
import ElementPlus from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css'
// import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/index.css'
import { ElIcon } from 'element-plus'

export default (app: App<Element>) => {
  app.use(ElementPlus, { size: 'small' }).use(ElIcon)
}
