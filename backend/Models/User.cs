using Microsoft.AspNetCore.DataProtection;

namespace backend.Models
{
    public class UserRegistration
    {
        public string userFirstName { get; set; } = string.Empty;
        public string userLastName { get; set; } = string.Empty;
        public string userProfileName { get; set; } = string.Empty;
        public Guid userID { get; set; }
        public string passwordHash { get; set; } = string.Empty;
        //private string userPassword { get; set; } = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        public string email {get;set;} = string.Empty;

    }

    public class UserLogin
    {
        public string Email {get;set;} = string.Empty;
        public string Password {get;set;}=string.Empty;
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