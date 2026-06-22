import { useState } from 'react'
import { authApi } from '../API/AuthApi'
import type { LoginRequest, RegisterRequest, ApiError } from '../types/Auth'

export function useAuth() {
  //const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      //const { token, user } = await authApi.login(credentials)
      const data = await authApi.login(credentials)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem('token', data.token)

      //setUser(user)
      return true

    } catch (err: unknown) {
      /*const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Login failed'
      setError(msg)*/

      setError((err as ApiError).message ?? "Login failed. Please try again.")
      return false

    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {

      const res = await authApi.register(data);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      return true;

    } catch (err) {

      setError((err as ApiError).message ?? "Registration failed. Please try again.")
      return false;

    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (credential: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {

      const data = await authApi.googleLogin(credential);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return true;

    } catch (err) {
      setError((err as ApiError).message ?? "Google sign-in failed. Please try again.")
      return false;

    } finally {
      setLoading(false);
    }
  }


  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }



  return { login, register, loginWithGoogle, logout, loading, error }
}