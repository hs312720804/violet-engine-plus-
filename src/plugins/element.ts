import { App } from 'vue'
import ElementPlus from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css'
// import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/index.css'
import * as ElIconModules from '@element-plus/icons-vue'

export default (app: App<Element>) => {
  // for (const key in ElIconModules) {
  //   console.log('transElIconName(key)===', transElIconName(key))
  //   app.component(transElIconName(key), ElIconModules[key])
  // }
  // // 统一注册Icon图标
  for (const iconName in ElIconModules) {
    if (Reflect.has(ElIconModules, iconName)) {
      console.log('transElIconName(key)===', iconName)
      const item = ElIconModules[iconName]
      app.component(iconName, item)
    }
  }
  app.use(ElementPlus, { size: 'small' })
}


// 此处是借鉴（抄袭）一位大佬的写法，勿喷
// https://blog.csdn.net/Alloom/article/details/119415984
function transElIconName(iconName: string) {
  return 'vue' + iconName.replace(/[A-Z]/g, match => '-' + match.toLowerCase())
}
