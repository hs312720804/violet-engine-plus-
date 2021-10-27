declare module '@ccprivate/utils' {
  type CValidate<T> = (arg: T) => boolean
  interface CUtils {
    format: {
      fillNumber: (number: number, len: number, fill: string) => string
      hidden: (str: string, frontLen: number, endLen: number) => string
    }
    validate: {
      isMobile: CValidate<string>
      isJSON: CValidate<string>
    }
  }
  declare const _default: CUtils
  export default _default
}
