import { http } from './Client'
import type { UpdateUsernameRequest, UpdatePasswordRequest, ProfileResponse } from '../types/Profile'

export const profileApi = {
    getProfile: () => http.get<ProfileResponse>("/user/profile"),
    updateUsername: (data: UpdateUsernameRequest) => http.put<{ message: string; userProfileName: string }>("user/username", data),
    updatePassword: (data: UpdatePasswordRequest) => http.put<{ message: string; }>("user/password", data),
    verifyPassword: (currentPassword: string) => http.post<{ message: string }>("/user/verify-password", { currentPassword })
}

