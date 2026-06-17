using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        //Authentication for new user Registration
        public async Task<AuthResponse> Register(UserRegistrationRequest request)
        {
            var emailExists = await _context.Users.AnyAsync(u => u.email == request.email);
            if (emailExists) throw new Exception("Email is already registered");

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.password);

            var user = new UserRegistration
            {
                userID = Guid.NewGuid(),
                userFirstName = request.userFirstName,
                userLastName = request.userLastName,
                userProfileName = request.userProfileName,
                email = request.email,
                passwordHash = passwordHash
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return BuildAuthResponse(user);
        }

        //Authentication for User login details
        public async Task<AuthResponse> Login(UserLogin request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == request.email);
            var isValidPassword = BCrypt.Net.BCrypt.Verify(request.password, user.passwordHash);

            if (user == null || !isValidPassword) throw new Exception("Invalid email or password");
            return BuildAuthResponse(user);
        }

        //Response with token and user details
        private AuthResponse BuildAuthResponse(UserRegistration user)
        {
            var token = GenerateJwtToken(user);
            //var expiry = DateTime.UtcNow.AddMinutes(double.Parse(_config["Jwt:ExpiryMinutes"] ?? "60"));
            var expiryMinutes = Convert.ToDouble(_config["Jwt:ExpiryMinutes"] ?? "60");
            var expiry = DateTime.UtcNow.AddMinutes(expiryMinutes);


            return new AuthResponse
            {
                token = token,
                expiresAt = expiry.ToString("0"),
                user = new UserDataTransfer
                {
                    userID = user.userID,
                    userFirstName = user.userFirstName,
                    userLastName = user.userLastName,
                    userProfileName = user.userProfileName,
                    email = user.email
                }
            };
        }

        //Creating a new JwtToken for user registration
        private string GenerateJwtToken(UserRegistration user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("userID", user.userID.ToString()),
                new Claim("profileName",user.userProfileName),
                new Claim(ClaimTypes.Email, user.email)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                //expires: DateTime.Now.AddMinutes(double.Parse(_config["Jwt:ExpiryMinutes"] ?? "60")),
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpiryMinutes"] ?? "60")),
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}