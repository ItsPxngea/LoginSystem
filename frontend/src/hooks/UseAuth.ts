import { useState } from 'react'
import { authApi } from '../API/AuthApi'
import type { User, LoginRequest } from '../types/Auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (credentials: LoginRequest) => {
    setLoading(true)
    setError(null)
    try {
      const { token, user } = await authApi.login(credentials)
      localStorage.setItem('token', token)
      setUser(user)
      return true
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Login failed'
      setError(msg)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return { user, loading, error, login, logout }
}