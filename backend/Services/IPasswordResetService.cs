using backend.Models;


namespace backend.Services
{
    public interface IPasswordResetService
    {
        Task ForgotPassword(ForgotPasswordRequest request);
        Task ResetPassword(PasswordResetRequest request);
    }
}