using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly IEmailValidationService _emailValidation;

        public AuthService(AppDbContext context, IConfiguration config, IEmailValidationService emailValidation)
        {
            _context = context;
            _config = config;
            _emailValidation = emailValidation;
        }

        public async Task<AuthResponse> GoogleLogin(string accessToken)
        {
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

            var response = await httpClient.GetAsync("https://www.googleapis.com/oauth2/v3/userinfo");

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("Invalid Google token");
            }

            var json = await response.Content.ReadAsByteArrayAsync();

            var googleUser = JsonSerializer.Deserialize<GoogleUserInfo>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (googleUser == null || string.IsNullOrEmpty(googleUser.Email))
                throw new Exception("Could not retrieve Google account email");

            var email = googleUser.Email;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email);

            if (user == null)
            {
                var randomPassword = Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32));

                user = new UserRegistration
                {
                    userID = Guid.NewGuid(),
                    userFirstName = googleUser.GivenName ?? "Google",
                    userLastName = googleUser.FamilyName ?? "User",
                    userProfileName = email.Split('@')[0],
                    email = email,
                    passwordHash = BCrypt.Net.BCrypt.HashPassword(randomPassword),
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
            }
            return await BuildAuthResponse(user);
        }

        public async Task<AuthResponse> Register(UserRegistrationRequest request)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.password);

            try
            {
                //normalizing email for random capital letters and spaces
                var email = request.email.ToLowerInvariant().Trim();

                var (isValid, reason) = await _emailValidation.ValidateAsync(email);

                if (!isValid)
                {
                    throw new Exception(reason ?? "Please enter a valid email address");
                }

                var emailExists = await _context.Users.AnyAsync(u => u.email == email);
                if (emailExists) throw new Exception("Email is already registered");

                var user = new UserRegistration
                {
                    userID = Guid.NewGuid(),
                    userFirstName = request.userFirstName,
                    userLastName = request.userLastName,
                    userProfileName = request.userProfileName,
                    email = email,
                    passwordHash = passwordHash
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                var response = await BuildAuthResponse(user);
                await transaction.CommitAsync();

                return response;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        //Authentication for User login details
        public async Task<AuthResponse> Login(UserLogin request)
        {
            //normalizing email for random capital letters and spaces
            var email = request.email.ToLowerInvariant().Trim();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email);
            var isValidPassword = BCrypt.Net.BCrypt.Verify(request.password, user.passwordHash);

            if (user == null || !isValidPassword) throw new Exception("Invalid email or password");
            return await BuildAuthResponse(user);
        }

        //Response with token and user details
        private async Task<AuthResponse> BuildAuthResponse(UserRegistration user)
        {
            var token = GenerateJwtToken(user);
            //var expiry = DateTime.UtcNow.AddMinutes(double.Parse(_config["Jwt:ExpiryMinutes"] ?? "60"));
            var expiryMinutes = Convert.ToDouble(_config["Jwt:ExpiryMinutes"] ?? "60");
            var expiry = DateTime.UtcNow.AddMinutes(expiryMinutes);

            var refreshTokenValue = Convert.ToHexString(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32));

            var refreshToken = new RefreshToken
            {
                Token = refreshTokenValue,
                UserId = user.userID,
                ExpiresAt = DateTime.UtcNow.AddHours(8),
                IsRevoked = false
            };
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();


            return new AuthResponse
            {
                token = token,
                refreshToken = refreshTokenValue,
                expiresAt = expiry.ToString("O"),
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

        public async Task Logout(string refreshTokenValue)
        {
            var refreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == refreshTokenValue);

            if (refreshToken == null || refreshToken.IsRevoked) return;

            refreshToken.IsRevoked = true;
            await _context.SaveChangesAsync();

        }

        public async Task<AuthResponse> RefreshAccessToken(string refreshTokenvalue)
        {
            var refreshtkn = await _context.RefreshTokens.Include(t => t.User).FirstOrDefaultAsync(t => t.Token == refreshTokenvalue);

            if (refreshtkn == null) throw new Exception("Invalid refresh token");

            if (refreshtkn.IsRevoked) throw new Exception("Session has ended, user has been logged out.");

            if (refreshtkn.ExpiresAt < DateTime.UtcNow) throw new Exception("Your sessions has expired, please login again");

            refreshtkn.IsRevoked = true;
            await _context.SaveChangesAsync();

            return await BuildAuthResponse(refreshtkn.User);
        }

    }
}