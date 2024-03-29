import { isObject } from '@/utlis/type'
const root = window
interface debounceOptions {
  maxWait?: number
  trailing?: boolean
  leading?: boolean
}
type debounceFunc = (...args: any) => any

function debounce (this: any, func: debounceFunc, wait: number, options?: debounceOptions) {
  let lastArgs: Parameters<debounceFunc> | undefined, lastThis: any, maxWait: number | undefined, result: ReturnType<debounceFunc>, timerId: number | undefined, lastCallTime: number | undefined
  let lastInvokeTime = 0
  let leading = false
  let maxing = false
  let trailing = true

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF = (!wait && wait !== 0 && typeof this.requestAnimationFrame === 'function')

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  wait = +wait || 0
  if (options && isObject(options)) {
    leading = !!options.leading
    maxing = 'maxWait' in options
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore：已经对 maxWait 做了为空的判断
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  function invokeFunc (time: number) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply<typeof thisArg, Parameters<debounceFunc>, ReturnType<debounceFunc>>(thisArg, args as Parameters<debounceFunc>)
    return result
  }

  function startTimer (this: any, pendingFunc: TimerHandler, wait: number) {
    if (useRAF) {
      this.cancelAnimationFrame(timerId)
      return this.requestAnimationFrame(pendingFunc)
    }
    return window.setTimeout(pendingFunc, wait)
  }

  function cancelTimer (id: number) {
    if (useRAF) {
      return root.cancelAnimationFrame(id)
    }
    window.clearTimeout(id)
  }

  function leadingEdge (time: number) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait)
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result
  }

  function remainingWait (time: number) {
    const timeSinceLastCall = time - (lastCallTime as number)
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxing
      ? Math.min(timeWaiting, (maxWait as number) - timeSinceLastInvoke)
      : timeWaiting
  }

  function shouldInvoke (time: number) {
    const timeSinceLastCall = time - (lastCallTime as number)
    const timeSinceLastInvoke = time - lastInvokeTime

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= (maxWait as number)))
  }

  function timerExpired () {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time))
  }

  function trailingEdge (time: number) {
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel () {
    if (timerId !== undefined) {
      cancelTimer(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  function flush () {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function pending () {
    return timerId !== undefined
  }

  function debounced (this: any, ...args: Array<any>) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait)
    }
    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending
  return debounced
}

export default debounce
