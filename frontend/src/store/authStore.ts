import { create } from 'zustand'
import { api } from '@/utils/api'

interface User {
  id: number
  nome: string
  email: string
  lojaId: number
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email: string, senha: string) => {
    try {
      const response = await api.post('/auth/login', { email, senha })
      const { token, user } = response.data

      localStorage.setItem('token', token)
      set({ user, token, isAuthenticated: true })
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
