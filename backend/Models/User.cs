using System.Text.Json.Serialization;

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

    public class UserLogin
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public string token { get; set; } = string.Empty;
        public string expiresAt { get; set; } = string.Empty;
        public UserDataTransfer user { get; set; } = new();
    }

    public class UserDataTransfer
    {
        public Guid userID { get; set; }
        public string userFirstName { get; set; } = string.Empty;
        public string userLastName { get; set; } = string.Empty;
        public string userProfileName { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
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