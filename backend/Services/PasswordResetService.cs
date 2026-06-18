using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class PasswordResetService : IPasswordResetService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _service;
        private readonly IConfiguration _config;

        public PasswordResetService(AppDbContext context, IEmailService emailService, IConfiguration config)
        {
            _context = context;
            _service = emailService;
            _config = config;
        }

        public async Task ForgotPassword(ForgotPasswordRequest request)
        {
            //Generalize email address for easier matchmaking to db
            var email = request.email.ToLowerInvariant().Trim();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email);

            //return even if nothing found
            if (user == null) return;

            //Invalidate tokens for user
            var existingTokens = await _context.PasswordResetToken.Where(t => t.UserID == user.userID && !t.IsUsed).ToListAsync();

            foreach (var exists in existingTokens)
            {
                exists.IsUsed = true;
            }

            //Generating new token
            var token = Convert.ToHexString(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32));


            var resetToken = new PasswordResetToken
            {
                UserID = user.userID,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                IsUsed = false
            };

            _context.PasswordResetToken.Add(resetToken);
            await _context.SaveChangesAsync();

            var frontendUrl = _config["Frontend:Url"] ?? "http://localhost:5173";
            var resetLink = $"{frontendUrl}/reset-password?token={token}";

            await _service.SendPasswordResetEmail(user.email, resetLink);

        }

        public async Task ResetPassword(PasswordResetRequest request)
        {
            if(request.newPassword!= request.confirmPassword)
            {
                throw new Exception("Passwords do not match");
            }
            if (request.newPassword.Length < 8)
            {
                throw new Exception("Password length must be at least 8 characters");
            }

            //Finding token in db
            var resetToken = await _context.PasswordResetToken.Include(t=>t.User).FirstOrDefaultAsync(t=>t.Token == request.token);

            if(resetToken == null)
            {
                throw new Exception("Invalid or expired reset link");
            }

            if (resetToken.IsUsed)
            {
                throw new Exception("Please request a new password link");
            }

            //Hash password and mark token as used once successful
            resetToken.User.passwordHash = BCrypt.Net.BCrypt.HashPassword(request.newPassword);
            resetToken.IsUsed = true;

            await _context.SaveChangesAsync();
        }

    }
}