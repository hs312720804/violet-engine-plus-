import md5 from 'js-md5'
const secretAdmin = 'cbba3704ee17da7cc11b06cf916489a3'

function paramsStrSort (paramsStr: string) {
  const urlStr = paramsStr.split('&').sort().join('&')
  const newUrl = urlStr + '&key=' + secretAdmin
  return md5(newUrl)
}


/**
 * 数据签名 简单版
 * @param params
 * @returns {*}
 */
export function getSign (params: any) {
  if (typeof params === 'string') {
    return paramsStrSort(params)
  } else if (typeof params === 'object') {
    const arr = []
    for (const i in params) {
      arr.push((i + '=' + JSON.stringify(params[i])))
    }
    return paramsStrSort(arr.join(('&')))
  }
}

