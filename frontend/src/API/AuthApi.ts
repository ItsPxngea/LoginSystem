import { http } from './Client'
import type { LoginRequest, LoginResponse, User } from '../types/Auth'

export const authApi = {
  login: (credentials: LoginRequest) =>
    http.post<LoginResponse>('/auth/login', credentials),

  logout: () =>
    http.post<void>('/auth/logout', {}),

  getCurrentUser: () =>
    http.get<User>('/auth/me'),
}