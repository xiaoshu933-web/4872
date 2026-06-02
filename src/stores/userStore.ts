import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface UserState {
  user: User | null
  token: string | null
  role: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: User) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        localStorage.setItem('token', token)
        localStorage.setItem('role', user.role)
        localStorage.setItem('userId', user.id)
        set({ user, token, role: user.role, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('userId')
        set({ user: null, token: null, role: null, isAuthenticated: false })
      },

      updateUser: (user: User) => {
        set({ user })
      },
    }),
    {
      name: 'user-storage',
    }
  )
)
