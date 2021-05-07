import qs from 'qs'
import axios from 'axios'
import store from '@/store'
// import NProgress from 'nprogress'
import { Loading } from 'element-ui'
import 'nprogress/nprogress.css'
let loadingInstance
export default function fetch ({
  method = 'get',
  url,
  data,
  params,
  isJSON = true,
  emptyToken = false // 是否需要token
}) {
  // NProgress.start()
  // debugger
  if (!loadingInstance) {
    // debugger
    loadingInstance = Loading.service({ target: document.querySelector('.el-main') })
  }
  let option = {
    method,
    url: `violet-api/${url}`,
    data: (isJSON || data instanceof FormData)
      ? data
      : typeof data === 'string'
        ? data
        : qs.stringify(data),
    params
  }
  let token = ''
  if (emptyToken) {
    token = ''
  } else {
    const user = store.state.user
    if (user) {
      token = user.token
    }
  }
  const app = this.app
  option.headers = {
    Authorization: token || ''
  }
  return axios(option)
    .then(function ({
      data
    }) {
      // NProgress.done()
      if (loadingInstance) {
        loadingInstance.close()
      }
      loadingInstance = ''
      if (data.success || data.code === '1000' || data.code === 200) {
        if (data.data) {
          return data.data
        } else {
          return data
        }
      } else {
        // eslint-disable-next-line no-throw-literal
        throw {
          code: data.code,
          message: data.msg
        }
      }
    })
    .catch(e => {
      // NProgress.done()
      if (loadingInstance) {
        loadingInstance.close()
      }
      loadingInstance = ''
      if ('response' in e && e.response.data.code === '403') {
        option.headers = {
          Authorization: ''
        }
        app.prototype.$logout().then(() => {
          window.location.reload()
        })
        throw e
      } else {
        throw e
      }
    })
}
