using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Data;

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
            _context= context;
        }


        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userID = User.FindFirst("userID")?.Value;

            if (userID==null) return Unauthorized();
            
            var user = await _context.Users.FindAsync(Guid.Parse(userID));

            if(User == null) return NotFound();

            //var user = await 
           return Ok(new
           {
               user.userID,
               user.userFirstName,
               user.userLastName,
               user.userProfileName,
               user.email
               
           });
        }
    }
}