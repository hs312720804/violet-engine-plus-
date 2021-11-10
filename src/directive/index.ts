import { App } from 'vue'
import debounce from './debounce'

export default (app: App) => {
  /**
  * 自定义全局防抖函数指令，用于button函数点击时多次触发问题
  * 使用方法 v-debounce=[fn, ev, timer] || v-debounce=[fn]
  */
  app.directive('debounce', {
    mounted (el, binding) {
      const [fn, event = 'click', timer = 500] = binding.value
      el.addEventListener(event, debounce(fn, timer, { leading: true }))
    }
  })
}
