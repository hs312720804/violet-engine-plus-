import { store } from '@/store'
import { UserModuleState } from '@/store/modules/user'
import fetch from './fetch'

export interface LoginArg { userName: string; password: string; loginType?: string; }

export function LoginService (data: LoginArg) {
  return fetch<UserModuleState>({
    method: 'post',
    url: 'login',
    data,
    isJSON: false,
    emptyToken: true
  }).then(res => {
    store.dispatch('user/saveUserInfo', res)
    return res
  })
}

// function loginout (data) {
//   return axios.post('logout', data)
// }
// function getValidateCode (data) {
//   return fetch({
//     method: 'post',
//     url: 'entry/psndoc/getValidateCode',
//     data,
//     isJSON: false
//   })
// }
