import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}
const baseURL = import.meta.env.VITE_API_URL
const api = axios.create({
  baseURL: `${baseURL}/api`,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().auth.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle Token Expiration (401)
let isRefreshing = false
let failedQueue: {
  resolve: (value: string | null) => void
  reject: (reason: unknown) => void
}[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig

    if (!originalRequest) return Promise.reject(error)

    const isAuthRequest = originalRequest.url?.includes('/auth/')

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      if (isRefreshing) {
        return new Promise<string | null>(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Attempt silent refresh using refresh token
        const { refreshToken } = useAuthStore.getState().auth

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {
            refresh_token: refreshToken,
          }
        )

        const { access_token } = response.data.data
        const { rememberMe } = useAuthStore.getState().auth
        useAuthStore.getState().auth.setAccessToken(access_token, rememberMe)

        processQueue(null, access_token)
        originalRequest.headers['Authorization'] = 'Bearer ' + access_token
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        // Total failure: logout user and redirect
        useAuthStore.getState().auth.reset()

        // Only redirect if not already on the sign-in page
        if (!window.location.pathname.includes('/sign-in')) {
          window.location.href = '/sign-in'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
