// interface storageType {
//   prefix: string
//   setItem: (key?: string, value?: any) => void
//   getItem: (key?: string) => string
//   removeItem: (key?: string) => void
//   // _cache: {
//   //   key: string| {key?: string;}
//   // }
//   _cache: any
// }
class Storage {
  private prefix: string
	private storage: globalThis.Storage
  private _cache: {
    key?: string | {key?: string;}
  }

  constructor (public name: string, localStorage: globalThis.Storage) {
    this.prefix = name + '/'
    this.storage = localStorage
    this._cache = {}
  }

  _parseKey (name: string) {
    return this.prefix + name
  }

  $set (key: string, value: string) {
    key = this._parseKey(key)
    value = JSON.stringify(value)
    this._cache[key] = JSON.parse(value)
    this.storage.setItem(key, value)
  }

  $get (key: string) {
    key = this._parseKey(key)
    if (!this._cache.hasOwnProperty(key)) {
      this._cache[key] = JSON.parse(this.storage.getItem(key))
    }
    return this._cache[key]
  }

  $remove (key: string) {
    key = this._parseKey(key)
    delete this._cache[key]
    return this.storage.removeItem(key)
  }

  $keys () {
    return Object.keys(this.storage)
      .filter(item => {
        return item.indexOf(this.prefix) > -1
      })
      .map(item => {
        return item.replace(this.prefix, '')
      })
  }
}
export default new Storage('APP_STATE', window.localStorage)
