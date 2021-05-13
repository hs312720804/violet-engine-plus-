// import Vue from 'vue'
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import getters from './getters'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {
}

export const key: InjectionKey<Store<RootState>> = Symbol()


export const storeOptions = {
  // mutations: {},
  modules: {
    app,
    user,
    errorLog,
    permission,
    tagsView
  },
  getters
}


export const store = createStore(storeOptions)


// export default store
export function useStore () {
  return baseUseStore(key) as typeof store
}
