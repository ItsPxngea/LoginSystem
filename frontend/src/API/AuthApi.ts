import { http } from './Client'
import type { LoginRequest, AuthResponse, RegisterRequest, } from '../types/Auth'

export const authApi = {
  login: (credentials: LoginRequest) =>
    http.post<AuthResponse>('/authLogin/login', credentials),

  logout: (refreshToken: string) =>
    http.post<void>('/auth/logout', {refreshToken}),

  /*getCurrentUser: () =>
    http.get<User>('/auth/me'),*/

  register: (data: RegisterRequest) =>
    http.post<AuthResponse>("/authlogin/register", data),

  googleLogin: (credential: string) =>
    http.post<AuthResponse>("/authLogin/google", { credential })
}