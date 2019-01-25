export const regEmail = /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
export const regVideoUrl = /^https?.+\.(mp4|avi|flv|mpg|rm|mov|asf|3gp|mkv|rmvb)$/i
export const regCoverUrl = /^https?.+\.(jpg|jpeg|gif|png|bmp)$/i
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
  else return `${CreatedAt.getFullYear()}-${CreatedAt.getMonth() + 1}-${CreatedAt.getDate()}`
}
/* eslint-disable */
export const parseChatTime = (old_time) => {
	const now = new Date(),
		old = new Date(old_time),
		now_year = now.getFullYear(),
		old_year = old.getFullYear(),
		now_month = now.getMonth() + 1,
		old_month = old.getMonth() + 1,
		now_date = now.getDate(),
		old_date = old.getDate(),
		format_hour = old.getHours().toString().padStart(2, '0'),
		format_month = old_month.toString().padStart(2, '0'),
		format_date = old_date.toString().padStart(2, '0'),
		format_minutes = old.getMinutes().toString().padStart(2, '0'),
		dayArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

	if (now_year != old_year) {
		return `${old_year}-${format_month}-${format_date} ${format_hour}:${format_minutes}`
	}
	if (now_month != old_month || (now_month == old_month && now_date - old_date >= 7)) {
		return `${format_month}-${format_date} ${format_hour}:${format_minutes}`
	}
	if (now_date == old_date) {
		return `${format_hour}:${format_minutes}`
	}
	if (now_date == old_date + 1) {
		return `昨天 ${format_hour}:${format_minutes}`
	}
	if (now_date == old_date + 2) {
		return `前天 ${format_hour}:${format_minutes}`
	}
	return `${dayArr[old.getDay()]} ${format_hour}:${format_minutes}`
}

export function deduplicateCommentList (list) {
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (list[i].Comment.commentId === list[j].Comment.commentId) list.splice(j, 1)
    }
  }
  return list
}

export function deduplicatePrivateLetter (list) {
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (list[i].fromId === list[j].fromId) list.splice(j, 1)
    }
  }
  return list
}