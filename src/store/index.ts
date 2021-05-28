// import Vue from 'vue'
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from 'secure-ls'
import app, { AppModuleState } from './modules/app'
import errorLog, { ErrorLogModuleState } from './modules/errorLog'
// import permission, { PermissionModuleState } from './modules/permission'
import tagsView, { TagModuleState } from './modules/tagsView'
import user, { UserModuleState } from './modules/user'
import getters from './getters'

// https://github.com/softvar/secure-ls
const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: 'dmlvbGV0LXNlY3JldC1rZXk=' }) // 使用 aes 对 持久化的 store 进行加密

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {
  app: AppModuleState
  errorLog: ErrorLogModuleState
  // permission: PermissionModuleState
  tagsView: TagModuleState
  user: UserModuleState
}

export const key: InjectionKey<Store<RootState>> = Symbol()

export const storeOptions = {
  // mutations: {},
  modules: {
    app,
    user,
    errorLog,
    // permission,
    tagsView
  },
  getters,
  plugins: [
    // store 持久化 https://github.com/robinvdvleuten/vuex-persistedstate#createpersistedstateoptions
    createPersistedState({
      key: 'violet',
      // paths: ['app'], // 要持久化的的状态
      // 使用 secure-ls 对持久化的 store 进行加密 https://github.com/robinvdvleuten/vuex-persistedstate#encrypted-local-storage
      storage: {
        getItem: key => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: key => ls.remove(key)
      }
    })
  ]
}

export const store = createStore(storeOptions)

export function useStore () {
  return baseUseStore(key) as typeof store
}
