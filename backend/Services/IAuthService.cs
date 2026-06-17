using backend.Models;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> Register(UserRegistrationRequest request);
        Task<AuthResponse> Login(UserLogin request);
        
    }
}