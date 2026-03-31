import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'shadcn-admin-access-token'
const REFRESH_TOKEN = 'shadcn-admin-refresh-token'
const USER_DATA = 'shadcn-admin-user-data'
const REMEMBER_ME = 'shadcn-admin-remember-me'

interface AuthUser {
  id: string
  email: string
  username: string
  role: {
    name: string
    slug: string
    permissions: Array<{
      id: string
      name: string
      slug: string
    }>
  }
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string, rememberMe?: boolean) => void
    resetAccessToken: () => void
    refreshToken: string
    setRefreshToken: (refreshToken: string) => void
    reset: () => void
    rememberMe: boolean
    setRememberMe: (rememberMe: boolean) => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieToken = getCookie(ACCESS_TOKEN)
  const cookieRefreshToken = getCookie(REFRESH_TOKEN)
  const cookieUser = getCookie(USER_DATA)
  const cookieRememberMe = getCookie(REMEMBER_ME)

  let initToken = ''
  let initRefreshToken = ''
  let initUser: AuthUser | null = null
  let initRememberMe = false

  try {
    initToken = cookieToken ? JSON.parse(cookieToken) : ''
  } catch (_e) {
    // Failed to parse token cookie
  }

  try {
    initRefreshToken = cookieRefreshToken ? JSON.parse(cookieRefreshToken) : ''
  } catch (_e) {
    // Failed to parse refresh token cookie
  }

  try {
    initUser = cookieUser ? JSON.parse(cookieUser) : null
  } catch (_e) {
    // Failed to parse user cookie
  }

  try {
    initRememberMe = cookieRememberMe ? JSON.parse(cookieRememberMe) : false
  } catch (_e) {
    // Failed to parse rememberMe cookie
  }

  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          if (user) {
            setCookie(USER_DATA, JSON.stringify(user))
          } else {
            removeCookie(USER_DATA)
          }
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
      refreshToken: initRefreshToken,
      setRefreshToken: (refreshToken) =>
        set((state) => {
          // Refresh token typically has longer expiry
          const maxAge = 60 * 60 * 24 * 30 // 30 days
          setCookie(REFRESH_TOKEN, JSON.stringify(refreshToken), maxAge)
          return { ...state, auth: { ...state.auth, refreshToken } }
        }),
      rememberMe: initRememberMe,
      setRememberMe: (rememberMe) =>
        set((state) => {
          setCookie(REMEMBER_ME, JSON.stringify(rememberMe))
          return { ...state, auth: { ...state.auth, rememberMe } }
        }),
      setAccessToken: (accessToken, rememberMe) =>
        set((state) => {
          const shouldRemember = rememberMe ?? state.auth.rememberMe
          // Use 30 days if rememberMe, else 7 days
          const maxAge = shouldRemember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken), maxAge)
          if (rememberMe !== undefined) {
            setCookie(REMEMBER_ME, JSON.stringify(rememberMe))
          }
          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken,
              rememberMe: rememberMe ?? state.auth.rememberMe,
            },
          }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(REFRESH_TOKEN)
          removeCookie(USER_DATA)
          removeCookie(REMEMBER_ME)
          return {
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
              refreshToken: '',
              rememberMe: false,
            },
          }
        }),
    },
  }
})
