import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshing = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh')

      if (!refresh) {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        if (!refreshing) {
          refreshing = axios.post(`${BASE_URL}/token/refresh/`, { refresh })
        }
        const res = await refreshing
        refreshing = null

        localStorage.setItem('access', res.data.access)
        original.headers.Authorization = `Bearer ${res.data.access}`
        return api(original)
      } catch (refreshError) {
        refreshing = null
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
