export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  expiresAt: string
  user: User
}

export interface User {
  id: string
  email: string
  name: string
}

export interface ApiError {
  message: string
  statusCode: number
}