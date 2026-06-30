using System.Text.Json.Serialization;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace backend.Models
{
    public class UserRegistration
    {
        public string userFirstName { get; set; } = string.Empty;
        public string userLastName { get; set; } = string.Empty;
        public string userProfileName { get; set; } = string.Empty;
        public Guid userID { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string passwordHash { get; set; } = string.Empty;
        //private string userPassword { get; set; } = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        public string email { get; set; } = string.Empty;

        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    }

    public class UserRegistrationRequest
    {
        //public Guid userID { get; set; }
        public string userFirstName { get; set; } = string.Empty;
        public string userLastName { get; set; } = string.Empty;
        public string userProfileName { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
        //public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }

    public class UserLogin
    {
        public string email { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public string token { get; set; } = string.Empty;
        public string expiresAt { get; set; } = string.Empty;
        public UserDataTransfer user { get; set; } = new();
        public string refreshToken { get; set; } = string.Empty;
    }

    public class UserDataTransfer
    {
        public Guid userID { get; set; }
        public string userFirstName { get; set; } = string.Empty;
        public string userLastName { get; set; } = string.Empty;
        public string userProfileName { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
    }

    public class GoogleUserInfo
    {
        public string? Email { get; set; }
        public string? GivenName { get; set; }
        public string? FamilyName { get; set; }
    }

    public class GoogleLoginRequest
    {
        public string credential { get; set; } = string.Empty;
    }

    public class LogoutRequest
    {
        public string refreshToken { get; set; } = string.Empty;
    }

    public class RefreshTokenRequest
    {
        public string refreshToken { get; set; } = string.Empty;
    }

    public class UpdateUsernameRequest
    {
        public string newUserName { get; set; } = string.Empty;
    }

    public class UpdatePasswordRequest
    {
        public string currentPassword { get; set; } = string.Empty;
        public string newPassword { get; set; } = string.Empty;
        public string confirmNewPassword { get; set; } = string.Empty;
    }

    /*public class Role
    {
        public int ID {get;set;}
        public string Name {get;set;} = string.Empty;
    }

    public class UserRole
    {
        Guid uder
    }
    */


}