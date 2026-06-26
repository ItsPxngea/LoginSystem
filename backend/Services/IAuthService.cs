using backend.Models;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> Register(UserRegistrationRequest request);
        Task<AuthResponse> Login(UserLogin request);
        Task<AuthResponse> GoogleLogin(string accessToken);
        Task<AuthResponse> RefreshAccessToken(string refreshToken);
        Task Logout(string refreshToken);

    }
}