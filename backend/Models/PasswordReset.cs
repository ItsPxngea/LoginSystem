namespace backend.Models
{
    public class ForgotPasswordRequest
    {
        public string email { get; set; } = string.Empty;
    }
    public class PasswordResetRequest
    {
        public string token { get; set; } = string.Empty;
        public string newPassword { get; set; } = string.Empty;
        public string confirmPassword { get; set; } = string.Empty;
    }
}