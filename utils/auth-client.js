// utils/auth-client.js
export function getAuth() {
  if (typeof window === 'undefined') return { token: null, user: null }
  return {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }
}

export function saveAuth(token, user) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export function authFetch(url, opts = {}) {
  const token = localStorage.getItem('token')
  const headers = opts.headers || {}
  if (token) headers['Authorization'] = 'Bearer ' + token
  return fetch(url, { ...opts, headers })
}
