using Microsoft.AspNetCore.Mvc;
using ranking_website.Models.User;
using ranking_website.Services.Auth;

namespace ranking_website.Controllers
{
    [ApiController]
    [Route("sigma/api/auth")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;

        [HttpPost("google")]
        public async Task<ActionResult<AuthResponse>> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                var result = await _authService.VerifyGoogleTokenAsync(request.IdToken);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error during authentication: {ex.Message}");
            }
        }
    }
}