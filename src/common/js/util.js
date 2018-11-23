export function debounce (func, delay, ctx) {
  let timer = null
  return function (...args) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(ctx, args)
    }, delay)
  }
}
