export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  userFirstName: string
  userLastName: string
  userProfileName: string
  email: string
  password: string
}

export interface UserDTO {
  userID: string
  userFirstName: string
  userLastName: string
  userProfileName: string
  email: string
}

export interface AuthResponse {
  token: string
  expiresAt: string
  user: UserDTO
  refreshToken: string
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

export interface GooogleLoginRequest {
  credential: string
}

export interface LogoutRequest {
  refreshToken: string
}

export interface RefreshToken {
  refreshToken: string
}