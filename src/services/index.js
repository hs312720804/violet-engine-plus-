import Vue from 'vue'
import fetch from './fetch'
import wrapService from '@/utlis/wrapService'
import * as login from './login'
import * as common from './common'
import * as department from './department'
import * as user from './user'
import * as role from './role'
import * as menu from './menu'
import * as dataResource from './dataResource'
const service = {
  app: Vue,
  init (cb) {
    cb()
  },
  // state: {
  //   access: ''
  // },
  fetch,
  ...common,
  ...login,
  ...department,
  ...user,
  ...role,
  ...menu,
  ...dataResource
}
Vue.prototype.$service = wrapService(service, ['app', 'init', 'fetch', 'getUserInfo'])
