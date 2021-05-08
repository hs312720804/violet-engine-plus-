import fetch from './fetch'
// import axios from 'axios'
import wrapService from '@/utlis/wrapService'

export const LoginService = wrapService(async data=> {
  // const user = {
  //   name: 'admin',
  //   password: '123456',
  //   token: 'abcde'
  // }
  // return Promise.resolve().then(() => {
  //   this.state = user
  //   return user
  // })
  const user = await fetch({
    method: 'post',
    url: 'login',
    data,
    isJSON: false
  })
  return user
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
