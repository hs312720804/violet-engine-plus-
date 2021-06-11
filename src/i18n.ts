import { createI18n, I18n } from 'vue-i18n'


function loadLocaleMessages (i18n: I18n<unknown, unknown, unknown, true>) {
  const locales = import.meta.glob('./locales/*.json') // require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  // const messages: LocaleMessages<VueMessageType> = {}

  for (const path in locales) {
    locales[path]().then(mod => {
      // console.log(path, mod)
      const matched = path.match(/([A-Za-z0-9-_]+)\./i)
      if (matched && matched.length > 1) {
        const locale = matched[1]
        // messages[locale] = mod
        console.log(locale, mod)
        i18n.global.setLocaleMessage(locale, mod)
      }
    })
  }

  // locales.keys().forEach(key => {
  //   const matched = key.match(/([A-Za-z0-9-_]+)\./i)
  //   if (matched && matched.length > 1) {
  //     const locale = matched[1]
  //     messages[locale] = locales(key)
  //   }
  // })
}


// export default new VueI18n({
//   locale: process.env.VUE_APP_I18N_LOCALE || 'en',
//   fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
//   messages: loadLocaleMessages()
// })
const i18n = createI18n({
  legacy: true, // 使用组合式API则要把 legacy 设置为 false
  locale: (import.meta.env.VITE_APP_I18N_LOCALE as string) || 'en',
  fallbackLocale: (import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE as string) || 'en'
})

loadLocaleMessages(i18n) // Lazy loading Message

export default i18n
