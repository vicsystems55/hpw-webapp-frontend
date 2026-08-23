import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:6600/api',
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('hpw_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hpw_token')
      localStorage.removeItem('hpw_user')
      localStorage.removeItem('hpw_permissions')
    }

    return Promise.reject(error)
  },
)

export default api
