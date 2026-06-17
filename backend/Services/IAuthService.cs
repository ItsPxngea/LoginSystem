using backend.Models;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> Register(UserRegistration request);
        Task<AuthResponse> Login(UserLogin request);
        
    }
}