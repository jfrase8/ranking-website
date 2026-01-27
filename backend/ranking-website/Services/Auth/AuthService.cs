using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;
using ranking_website.Models.User;
using ranking_website.Services.User;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ranking_website.Services.Auth
{
    public class AuthService(IUserService userService, IConfiguration configuration) : IAuthService
    {
        private readonly IUserService _userService = userService;
        private readonly string _jwtSecret = configuration["Jwt:Secret"] ?? throw new InvalidOperationException("Jwt:Secret configuration is missing");
        private readonly string _googleClientId = configuration["Google:ClientId"] ?? throw new InvalidOperationException("Google:ClientId configuration is missing");
        private readonly string _jwtIssuer = configuration["Jwt:Issuer"] ?? "ranking-website";

        public async Task<AuthResponse> VerifyGoogleTokenAsync(string idToken)
        {
            try
            {
                // Verify Google token
                var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = [_googleClientId]
                });

                // Check if user exists (using Google Subject ID as the user ID)
                var user = await _userService.GetUserByIdAsync(payload.Subject);

                // Create user if doesn't exist
                user ??= await _userService.CreateUserAsync(new CreateUserRequest
                {
                    Id = payload.Subject, // Google's unique ID becomes our user ID
                    UserName = payload.Name ?? payload.Email.Split('@')[0],
                    Email = payload.Email
                });

                // Update avatar if provided and different (works for both new and existing users)
                if (!string.IsNullOrEmpty(payload.Picture) && user.AvatarUrl != payload.Picture)
                {
                    user = await _userService.UpdateUserAsync(user.Id, new UpdateUserRequest
                    {
                        AvatarUrl = payload.Picture
                    });
                }

                // Return error if user is still null
                if (user == null) throw new Exception("User creation was unsuccessful");

                // Generate JWT token
                var token = GenerateJwtToken(user.Id);

                return new AuthResponse
                {
                    Token = token,
                    User = user
                };
            }
            catch (InvalidJwtException)
            {
                throw new UnauthorizedAccessException("Invalid Google token");
            }
        }

        private string GenerateJwtToken(string userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                [
                    new Claim(ClaimTypes.NameIdentifier, userId)
                ]),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _jwtIssuer,
                NotBefore = DateTime.UtcNow,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
