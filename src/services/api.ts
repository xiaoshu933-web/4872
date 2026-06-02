import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

let hasRedirected401 = false

api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401 && !hasRedirected401) {
      hasRedirected401 = true
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
