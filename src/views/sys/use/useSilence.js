import Vue from 'vue'
import { watch as originWatch } from 'vue'
export default function useSilence () {
  let isSilent = false
  function silenceStart () {
    isSilent = true
  }
  function silenceEnd () {
    Vue.nextTick(() => {
      isSilent = false
    })
  }
  function silence (fn) {
    silenceStart()
    fn()
    silenceEnd()
  }

  function watch (expOrFn, callback, options) {
    const callbackWrapped = function () {
      if (!isSilent) {
        callback.apply(this, arguments)
      }
    }
    originWatch(expOrFn, callbackWrapped, options)
  }
  return { silence, silenceStart, silenceEnd, watch }
}
