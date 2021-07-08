import { ElNotification } from 'element-plus'
interface Service<Arg, Res> {
  (arg: Arg): Promise<Res>
}
/**
 *
 * @param {Object} service 传入的服务方法集对象
 * @param {Array} noNoteArray 不需要async的方法key数组
 */
function wrapService<Arg, Res> (service: Service<Arg, Res>) {
  // const $service = {
  //   service
  // }
  // debugger
  return async (args: Arg, message?: string) => {
    return service(args)
      .then(result => {
        if (message) {
          ElNotification({
            title: '操作成功',
            type: 'success',
            message
          })
        }
        return result
      })
      .catch(error => {
        ElNotification({
          title: '操作失败',
          type: 'error',
          message: error.message
        })
        return Promise.reject(error)
      })
  }

  // Object.keys(service).forEach((key) => {
  //   if (typeof service[key] === 'function' && noNoteArray.indexOf(key) < 0) {
  //     $service[key] = async (args, message) => {
  //       return service[key](args)
  //         .then((result) => {
  //           if (message) {
  //             Notification({
  //               title: '操作成功',
  //               type: 'success',
  //               message
  //             })
  //           }
  //           return result
  //         })
  //         .catch((error) => {
  //           Notification({
  //             title: '操作失败',
  //             type: 'error',
  //             message: error.message
  //           })
  //           return Promise.reject(error)
  //         })
  //     }
  //   } else {
  //     $service[key] = service[key]
  //   }
  // })
  // return $service
}

export default wrapService
