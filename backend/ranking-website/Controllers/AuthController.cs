// Controllers/AuthController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ranking_website.Models.Auth;
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
                return StatusCode(500, new { message = $"Error during authentication: {ex.Message}" });
            }
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<TokenResponse>> Refresh([FromBody] RefreshRequest request)
        {
            try
            {
                var result = await _authService.RefreshTokenAsync(request.RefreshToken);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error refreshing token: {ex.Message}" });
            }
        }

        [HttpPost("ping")]
        [Authorize]
        public async Task<ActionResult> Ping([FromBody] PingRequest request)
        {
            try
            {
                var success = await _authService.PingActivityAsync(request.RefreshToken);

                if (!success)
                {
                    return Unauthorized(new { message = "Session expired" });
                }

                return Ok(new { message = "Activity recorded" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error pinging: {ex.Message}" });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult> Logout([FromBody] LogoutRequest request)
        {
            try
            {
                await _authService.RevokeRefreshTokenAsync(request.RefreshToken);
                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error logging out: {ex.Message}" });
            }
        }
    }
}