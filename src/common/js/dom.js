export function getData (el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

export function addClass (el, className) {
  if (hasClass(el, className)) return
  el.classList.add(className)
}

export function removeClass (el, className) {
  if (!hasClass(el, className)) return
  el.classList.remove(className)
}

export function hasClass (el, className) {
  if (el.classList.contains(className)) return true
  return false
}

export function toggleClass (el, className) {
  hasClass(el, className) ? removeClass(el, className) : addClass(el, className)
}
