using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UserController(AppDbContext context)
        {
            _context = context;
        }
        
        [HttpGet("profile")]
        
        public async Task<IActionResult> GetProfile()
        {
            var userID = User.FindFirst("userID")?.Value;

            if (userID == null) return Unauthorized();

            var user = await _context.Users.FindAsync(Guid.Parse(userID));

            if (User == null) return NotFound();

            return Ok(new
            {
                user!.userID,
                user.userFirstName,
                user.userLastName,
                user.userProfileName,
                user.email

            });
        }

        [HttpPut("username")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> UpdateUsername([FromBody] UpdateUsernameRequest request)
        {
            var newUsername = request.newUserName.Trim();

            if (string.IsNullOrWhiteSpace(newUsername)) return BadRequest(new { message = "Username cannot be empty" });

            if (newUsername.Length < 6 || newUsername.Length > 50) return BadRequest(new { message = "Username must be more than 6 characters" });

            var userID = User.FindFirst("userID")?.Value;
            var user = await _context.Users.FindAsync(Guid.Parse(userID!));

            if (user == null) return NotFound();

            var taken = await _context.Users.AnyAsync(u => u.userProfileName == newUsername && u.userID.ToString() != userID);

            if (taken) return Conflict(new { message = "Username already exists. Please make another selection" });

            user.userProfileName = newUsername;
            await _context.SaveChangesAsync();

            return NoContent();

        }

        [HttpPut("password")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordRequest request)
        {
            if (request.newPassword != request.confirmNewPassword) return BadRequest(new { message = "Passwords do not match" });

            if (request.newPassword.Length < 6) return BadRequest(new { message = "Password must be at least 6 characters" });

            var userID = User.FindFirst("userID")?.Value;
            var user = await _context.Users.FindAsync(Guid.Parse(userID!));

            if (user == null) return NotFound();
            //Ensuring current password is matching what is in the database
            var isCurrentPasswordValid = BCrypt.Net.BCrypt.Verify(request.currentPassword, user.passwordHash);

            if (!isCurrentPasswordValid) return StatusCode(405, new { message = "Password is not valid" });

            user.passwordHash = BCrypt.Net.BCrypt.HashPassword(request.newPassword);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("verify-password")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> VerifyPassword([FromBody] VerifyPasswordRequest request)
        {
            var userID = User.FindFirst("userID")?.Value;
            var user = await _context.Users.FindAsync(Guid.Parse(userID!));

            if (user == null) return NotFound();

            var isValid = BCrypt.Net.BCrypt.Verify(request.currentPassword, user.passwordHash);
            if (!isValid) return StatusCode(405, new { message = "Password is not valid" });

            return Ok(new { message = "Password verified" });
        }

    }
}