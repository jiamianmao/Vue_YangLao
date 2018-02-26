import storage from 'good-storage'
import cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return storage.get(TokenKey)
}

export function setToken(token) {
  return storage.set(TokenKey, token)
}

export function removeToken() {
  cookies.remove('CSESSIONID')
  cookies.remove('CSESSIONNAME')
  cookies.remove('JSESSIONID')
  window._dataInfo = null
  storage.clear()
}
