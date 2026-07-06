using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PasswordResetController : ControllerBase
    {
        private readonly IPasswordResetService _service;
        private readonly AppDbContext _context;

        public PasswordResetController(IPasswordResetService service, AppDbContext context)
        {
            _service = service;
            _context = context;
        }


        [HttpPost("forgot")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(e => e.email == request.email);
            if (user == null || user.provider == AuthProvider.Google)
            {
                return Ok(new { message = "A reset link has been sent to the email address" });
            }
            await _service.ForgotPassword(request);

            return Ok(new { message = "A reset link has been sent to the email address" });
        }

        [HttpPost("reset")]
        public async Task<IActionResult> ResetPassword([FromBody] PasswordResetRequest request)
        {
            try
            {
                await _service.ResetPassword(request);
                return Ok(new { message = "Password has been reset successfully" });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
    }
}