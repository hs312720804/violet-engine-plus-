
import { watch, computed, onBeforeMount, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import { AppDeviceType } from '@/store/modules/app'

const { body } = document
const MOBILE_WIDTH = 992 // refer to Bootstrap's responsive design
const MINI_WIDTH = 1366

export type HeaderDropdownCommand = 'logout' | 'account'
export interface DeviceChangeMethods {
  (device: AppDeviceType): void
}
interface MainWindowResizeParams {
  deviceChangeMethods: DeviceChangeMethods
}
export default function useMainWindowResize ({ deviceChangeMethods }: MainWindowResizeParams) {

  const $route = useRoute()
  const $store = useStore()

  const isCollapseMenu = computed(() => $store.state.app.menu.isCollapse) // ref(false)
  const isShowMenu = computed(() => $store.state.app.menu.isShow) // ref(true)

  const sidebar = computed(() => $store.state.app.sidebar)
  const device = computed(() => $store.state.app.device)

  function isMobile () {
    const rect = body.getBoundingClientRect()
    return rect.width - 1 < MOBILE_WIDTH
  }
  function isMiniScreen () {
    const rect = body.getBoundingClientRect()
    return rect.width - 1 < MINI_WIDTH && rect.width - 1 >= MOBILE_WIDTH
  }
  function resizeHandler () {
    console.log('resizeHandler')
    if (!document.hidden) {
      const _isMobile = isMobile()
      const _isMiniScreen = isMiniScreen()

      let device = ''
      if (_isMiniScreen) {
        device = 'miniScreen'
      } else if (_isMobile) {
        device = 'mobile'
      } else {
        device = 'desktop'
      }
      $store.commit('app/TOGGLE_DEVICE', device)

      if (_isMiniScreen) {
        $store.commit('app/CLOSE_SIDEBAR', true)
      } else if (_isMobile) {
        $store.commit('app/CLOSE_SIDEBAR', true)
      }
    }
  }

  watch(device, device => { deviceChangeMethods(device) })

  watch($route, () => {
    if (device.value === 'mobile' && sidebar.value.opened) {
      $store.commit('app/CLOSE_SIDEBAR', false)
    }
  })

  onBeforeMount(() => {
    window.addEventListener('resize', resizeHandler)
  })
  onMounted(() => {
    const _isMobile = isMobile()
    const _isMiniScreen = isMiniScreen()
    if (_isMiniScreen) {
      $store.commit('app/TOGGLE_DEVICE', 'miniScreen')
      $store.commit('app/CLOSE_SIDEBAR', true)
    }
    if (_isMobile) {
      $store.commit('app/TOGGLE_DEVICE', 'mobile')
      $store.commit('app/CLOSE_SIDEBAR', true)
    }
  })
  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler)
  })
  return {
    isCollapseMenu,
    isShowMenu,
    device
  }
}
