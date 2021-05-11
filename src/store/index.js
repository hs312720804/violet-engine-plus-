// import Vue from 'vue'
import { createStore } from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import getters from './getters'

const store = createStore({
  modules: {
    app,
    user,
    errorLog,
    permission,
    tagsView
  },
  getters
})

export default store
