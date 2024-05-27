// token本地化
const TOKENKEY = 'crayon_class'

function setToken(token) {
  return localStorage.setItem(TOKENKEY, token)
}

function getToken() {
  return localStorage.getItem(TOKENKEY)
}

function removeToken() {
  return localStorage.removeItem(TOKENKEY)
}

export { setToken, getToken, removeToken }
