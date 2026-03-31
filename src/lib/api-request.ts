import { useAuthStore } from '@/stores/auth-store'
import api from './axios'

/**
 * API Request wrapper that automatically includes access token in all requests
 */

interface RequestOptions {
  headers?: Record<string, string>
  [key: string]: any
}

/**
 * GET request with access token
 */
export async function apiGet<T = any>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  const token = useAuthStore.getState().auth.accessToken
  const headers = {
    ...options?.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  const response = await api.get(url, {
    ...options,
    headers,
  })

  return response.data
}

/**
 * POST request with access token
 */
export async function apiPost<T = any>(
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<T> {
  const token = useAuthStore.getState().auth.accessToken
  const headers = {
    ...options?.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  const response = await api.post(url, data, {
    ...options,
    headers,
  })

  return response.data
}

/**
 * PUT request with access token
 */
export async function apiPut<T = any>(
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<T> {
  const token = useAuthStore.getState().auth.accessToken
  const headers = {
    ...options?.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  const response = await api.put(url, data, {
    ...options,
    headers,
  })

  return response.data
}

/**
 * PATCH request with access token
 */
export async function apiPatch<T = any>(
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<T> {
  const token = useAuthStore.getState().auth.accessToken
  const headers = {
    ...options?.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  const response = await api.patch(url, data, {
    ...options,
    headers,
  })

  return response.data
}

/**
 * DELETE request with access token
 */
export async function apiDelete<T = any>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  const token = useAuthStore.getState().auth.accessToken
  const headers = {
    ...options?.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  const response = await api.delete(url, {
    ...options,
    headers,
  })

  return response.data
}

/**
 * Upload file with access token
 */
export async function apiUploadFile<T = any>(
  url: string,
  file: File,
  options?: RequestOptions
): Promise<T> {
  const token = useAuthStore.getState().auth.accessToken
  const formData = new FormData()
  formData.append('file', file)

  const headers = {
    ...options?.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  const response = await api.post(url, formData, {
    ...options,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers,
    },
  })

  return response.data
}
