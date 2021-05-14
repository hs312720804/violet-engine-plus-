import { store } from '@/store'

const { body } = document
const MOBILE_WIDTH = 992 // refer to Bootstrap's responsive design
const MINI_WIDTH = 1366
export default {
  watch: {
    $route (route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('closeSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount () {
    window.addEventListener('resize', this.resizeHandler)
  },
  mounted () {
    const isMobile = this.isMobile()
    const isMiniScreen = this.isMiniScreen()
    if (isMiniScreen) {
      store.dispatch('toggleDevice', 'miniScreen')
      store.dispatch('closeSideBar', { withoutAnimation: true })
    }
    if (isMobile) {
      store.dispatch('toggleDevice', 'mobile')
      store.dispatch('closeSideBar', { withoutAnimation: true })
    }
  },
  methods: {
    isMobile () {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < MOBILE_WIDTH
    },
    isMiniScreen () {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < MINI_WIDTH && rect.width - 1 >= MOBILE_WIDTH
    },
    resizeHandler () {
      if (!document.hidden) {
        const isMobile = this.isMobile()
        const isMiniScreen = this.isMiniScreen()
        let device = ''
        if (isMiniScreen) {
          device = 'miniScreen'
        } else if (isMobile) {
          device = 'mobile'
        } else {
          device = 'desktop'
        }

        store.dispatch('toggleDevice', device)
        if (isMiniScreen) {
          store.dispatch('closeSideBar', { withoutAnimation: true })
        } else if (isMobile) {
          store.dispatch('closeSideBar', { withoutAnimation: true })
        }
      }
    }
  }
}
