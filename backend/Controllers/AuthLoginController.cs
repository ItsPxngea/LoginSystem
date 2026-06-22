using backend.Services;
using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthLoginController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthLoginController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]

        public async Task<IActionResult> Register([FromBody] UserRegistrationRequest request)
        {
            //Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(response));
            try
            {   //Console.WriteLine("Test: "+ System.Text.Json.JsonSerializer.Serialize(request));
                var response = await _authService.Register(request);

                return Ok(response);
            }
            catch (Exception e)
            {

                //Console.WriteLine(e.ToString() +"\nthis is test 1");
                return BadRequest(new { message = e.Message });
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
            catch (Exception e)
            {
                return Unauthorized(new { message = e.Message });
            }
        }


        [HttpPost("google")]
        public async Task<IActionResult>GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                var response = await _authService.GoogleLogin(request.credential);
                return Ok(response);
            }   
            catch (Exception e)
            {
                return Unauthorized(new {message = e.Message});
            }
        }


    }
}