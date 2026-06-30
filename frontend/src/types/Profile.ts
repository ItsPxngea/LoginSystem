export interface UpdateUsernameRequest {
    newUsername: string
}

export interface UpdatePasswordRequest {
    newPassword: string
    confirmNewPassword: string
    currentPassword: string
}

export interface ProfileResponse {
    userID: string
    userFirstName: string
    userLastName: string
    userProfileName: string
    email: string
}