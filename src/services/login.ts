import { store } from '@/store'
import { UserModuleState } from '@/store/modules/user'
import fetch from './fetch'
import wrapService from '@/utlis/wrapService'

export interface LoginArg { userName: string; password: string; loginType?: string; }

export const LoginService = wrapService<LoginArg, UserModuleState>(async data => {

  return fetch({
    method: 'post',
    url: 'login',
    data,
    isJSON: false,
    emptyToken: true
  }).then(res => {
    store.dispatch('user/saveUserInfo', res)
    return res
  })
})

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
// export let LoginoutService = wrapService({ loginout })
// export let GetValidateCodeService = wrapService({ getValidateCode })
