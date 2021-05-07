import Vue from 'vue'

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    appState?: VueAppState.StateOptions
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    /** A Vue plugin for sharing and storing app-level data and state with memory or localStorage.  */
    $appState: VueAppState.Storage
  }
}
/**
  * Install "@william17/vue-app-state" into Vue.
  * Please do not invoke this method directly.
  * Call `Vue.use(AppState)` to install.
  */
export function install (Vue: Vue): void;
