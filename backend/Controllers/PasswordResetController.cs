using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PasswordResetController : ControllerBase
    {
        private readonly IPasswordResetService _service;

        public PasswordResetController(IPasswordResetService service)
        {
            _service = service;
        }

        [HttpPost("forgot")]
        public async Task<IActionResult> ForgotPassword([FromBody]ForgotPasswordRequest request)
        {
            await _service.ForgotPassword(request);

            return Ok(new {message = "A reset link has been sent to the email address"});
        }

        [HttpPost("reset")]
        public async Task<IActionResult>ResetPassword([FromBody]PasswordResetRequest request)
        {
            try{
                await _service.ResetPassword(request);
                return Ok(new{message = "Password has been reset successfully"});
            }
            catch(Exception e)
            {
                return BadRequest(new {message = e.Message});
            }
        }
    }
}