using backend.Services;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthLoginController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly AppDbContext _context;
        public AuthLoginController(IAuthService authService, AppDbContext context)
        {
            _authService = authService;
            _context = context;
        }

        [HttpPost("register")]

        public async Task<IActionResult> Register([FromBody] UserRegistrationRequest request)
        {
            //Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(response));
            var existing = await _context.Users.FirstOrDefaultAsync(e => e.email == request.email);

            if (existing != null || existing!.provider == AuthProvider.Google) return Conflict(new { message = "Unable to register, please check if you have registered in before" });

            try
            {   //Console.WriteLine("Test: "+ System.Text.Json.JsonSerializer.Serialize(request));
                var response = await _authService.Register(request);

                return Ok(response);
            }
            catch (Exception e)
            {

                //Console.WriteLine(e.ToString() +"\nthis is test 1");
                return Conflict(new { message = e.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin request)
        {
            try
            {
                var response = await _authService.Login(request);
                return Ok(response);
            }
            catch
            {
                return Unauthorized(new { message = "Please enter a valid email or password" });
            }
        }


        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            //GoogleJsonWebSignature.Payload payload;
            try
            {

                var response = await _authService.GoogleLogin(request.credential);
                return Ok(response);
            }
            catch (Exception e)
            {
                return Unauthorized(new { message = e.Message });
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
        {
            await _authService.Logout(request.refreshToken);
            return Ok(new { message = "Logged out successfully." });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var response = await _authService.RefreshAccessToken(request.refreshToken);
                return Ok(response);
            }
            catch (Exception e)
            {
                return Unauthorized(new { message = e.Message });
            }
        }


    }
}