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
  hydrateFromLocalStorage: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        localStorage.setItem('token', token)
        localStorage.setItem('role', user.role)
        localStorage.setItem('userId', user.id)
        if (user.phone) {
          localStorage.setItem('visitorPhone', user.phone)
        }
        set({ user, token, role: user.role, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('userId')
        localStorage.removeItem('visitorPhone')
        localStorage.removeItem('merchantPhone')
        set({ user: null, token: null, role: null, isAuthenticated: false })
      },

      updateUser: (user: User) => {
        set({ user })
      },

      hydrateFromLocalStorage: () => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')
        const userId = localStorage.getItem('userId')
        const visitorPhone = localStorage.getItem('visitorPhone')
        const merchantPhone = localStorage.getItem('merchantPhone')

        if (token && role && !get().isAuthenticated) {
          const now = new Date().toISOString()
          const user: User = {
            id: userId || `user_${Date.now()}`,
            phone: visitorPhone || merchantPhone || '',
            role: role as 'visitor' | 'merchant' | 'staff' | 'admin',
            createdAt: now,
            updatedAt: now,
          }
          set({ user, token, role, isAuthenticated: true })
        }
      },
    }),
    {
      name: 'user-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrateFromLocalStorage()
        }
      },
    }
  )
)
