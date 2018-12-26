export const regEmail = /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

export function debounce (func, delay, ctx) {
  let timer = null
  return function (...args) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(ctx, args)
    }, delay)
  }
}

export function formatTime (Timestamp) {
  const CreatedAt = new Date(Timestamp)
  const Now = new Date()
  const deltaTimestanmp = Now - CreatedAt
  let minutes = deltaTimestanmp / 1000 / 60
  if (minutes < 0) return '未知'
  else if (minutes < 1) return '刚刚'
  else if (minutes < 60) return `${Math.floor(minutes)}分钟前`
  else if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`
  else if (minutes < 2880) return `昨天 ${CreatedAt.getHours()}:${CreatedAt.getMinutes()}`
  else return `${CreatedAt.getFullYear()}-${CreatedAt.getMonth() + 1}-${CreatedAt.CreatedAt.getDate()}`
}
