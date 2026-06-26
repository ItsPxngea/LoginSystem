import { useState } from 'react'
import { authApi } from '../API/AuthApi'
import type { LoginRequest, RegisterRequest, ApiError, UserDTO, AuthResponse } from '../types/Auth'

export function useAuth() {
  //const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const storeSession = (data: AuthResponse, rememberMe: boolean) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    const other = rememberMe ? sessionStorage : localStorage;

    storage.setItem("token", data.token);
    storage.setItem("user", JSON.stringify(data.user));
    storage.setItem("refreshToken", data.refreshToken);

    other.removeItem("token");
    other.removeItem("user");
    other.removeItem("refreshToken")

  }

  const getRefreshToken = (): string | null => {
    return localStorage.getItem("refreshToken") ?? sessionStorage.getItem("refreshToken");
  }

  const login = async (credentials: LoginRequest, rememberMe: boolean = false): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      //const { token, user } = await authApi.login(credentials)
      const data = await authApi.login(credentials)
      storeSession(data, rememberMe);
      //localStorage.setItem("user", JSON.stringify(data.user))
      //localStorage.setItem('token', data.token)


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
      //localStorage.setItem("token", res.token);
      //localStorage.setItem("user", JSON.stringify(res.user));
      storeSession(res, true);

      return true;

    } catch (err) {

      setError((err as ApiError).message ?? "Registration failed. Please try again.")
      return false;

    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (accessToken: string, rememberMe: boolean): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {

      const data = await authApi.googleLogin(accessToken);
      //localStorage.setItem("token", data.token);
      //localStorage.setItem("user", JSON.stringify(data.user));
      storeSession(data, rememberMe)

      return true;

    } catch (err) {
      setError((err as ApiError).message ?? "Google sign-in failed. Please try again.")
      return false;

    } finally {
      setLoading(false);
    }
  }


  const logout = async (): Promise<void> => {

    const refreshToken = getRefreshToken();

    if(refreshToken){
      try{
        await authApi.logout(refreshToken)
      }catch{

      }
    }
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("refreshToken")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("refreshToken")
  }


  const getCurrentUser = (): UserDTO | null => {
    const raw = localStorage.getItem("user") ?? sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }


  return { login, register, loginWithGoogle, logout, getCurrentUser, loading, error }
}