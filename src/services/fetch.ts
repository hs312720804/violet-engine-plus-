import qs from 'qs'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { store } from '@/store'
// import NProgress from 'nprogress'
import { ElLoading } from 'element-plus'
// import 'nprogress/nprogress.css'

interface Res { code: number | string; success: boolean; data: any; msg: string; }

type IfetchArg = {
  isJSON?: boolean
  /** 是否清空token */
  emptyToken?: boolean
} & AxiosRequestConfig

let loadingInstance: import('element-plus/lib/el-loading/src/loading.type').ILoadingInstance | undefined

export default function fetch ({
  method = 'get',
  url,
  data = undefined,
  params = undefined,
  isJSON = true,
  emptyToken = false
}: IfetchArg) {
  // NProgress.start()
  // debugger
  if (!loadingInstance) {
    // debugger
    loadingInstance = ElLoading.service({ target: document.querySelector('.el-main') as HTMLElement })
  }
  const option: AxiosRequestConfig = {
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
    if (store.getters.token) {
      token = store.getters.token
    }
  }
  // const app = this.app
  option.headers = {
    Authorization: token || ''
  }
  return axios(option)
    .then(function ({ data }:AxiosResponse<Res>) {
      // const data = xxx.data
      // NProgress.done()
      if (loadingInstance) {
        loadingInstance.close()
      }
      loadingInstance = undefined
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
      loadingInstance = undefined
      if ('response' in e && e.response.data.code === '403') {
        option.headers = {
          Authorization: ''
        }
        // app.prototype.$logout().then(() => {
        //   window.location.reload()
        // })
        throw e
      } else {
        throw e
      }
    })
}
