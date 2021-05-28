import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n'


function loadLocaleMessages (): LocaleMessages<VueMessageType> {
  const locales = import.meta.glob('./locales/*.json') // require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages: LocaleMessages<VueMessageType> = {}

  for (const path in locales) {
    locales[path]().then(mod => {
      // console.log(path, mod)
      const matched = path.match(/([A-Za-z0-9-_]+)\./i)
      if (matched && matched.length > 1) {
        const locale = matched[1]
        messages[locale] = mod
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
  return messages
}

// export default new VueI18n({
//   locale: process.env.VUE_APP_I18N_LOCALE || 'en',
//   fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
//   messages: loadLocaleMessages()
// })
export default createI18n({
  legacy: false,
  locale: import.meta.env.VITE_APP_I18N_LOCALE || 'en',
  fallbackLocale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})
