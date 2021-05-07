import axios from 'axios'
function login (data) {
  // const user = {
  //   name: 'admin',
  //   password: '123456',
  //   token: 'abcde'
  // }
  // return Promise.resolve().then(() => {
  //   this.state = user
  //   return user
  // })
  return this.fetch({
    method: 'post',
    url: 'login',
    data,
    isJSON: false
  }).then((user) => {
    // this.state = user
    return user
  })
}

function loginout (data) {
  return axios.post('logout', data)
}
function getValidateCode (data) {
  return this.fetch({
    method: 'post',
    url: 'entry/psndoc/getValidateCode',
    data,
    isJSON: false
  })
}
export {
  login,
  loginout,
  getValidateCode
}
