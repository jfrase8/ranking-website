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
        private readonly string _googleClientId = configuration["Google:ClientId"] ?? throw new ArgumentNullException("Google:ClientId");
        private readonly string _jwtSecret = configuration["Jwt:Secret"] ?? throw new ArgumentNullException("Jwt:Secret");
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
                if (user == null)
                {
                    user = await _userService.CreateUserAsync(new CreateUserRequest
                    {
                        Id = payload.Subject, // Google's unique ID becomes our user ID
                        UserName = payload.Name ?? payload.Email.Split('@')[0],
                        Email = payload.Email
                    });

                    // Update avatar if provided by Google
                    if (!string.IsNullOrEmpty(payload.Picture))
                    {
                        await _userService.UpdateUserAsync(user.Id, new UpdateUserRequest
                        {
                            AvatarUrl = payload.Picture
                        });
                        user.AvatarUrl = payload.Picture;
                    }
                }

                // Always update avatar on login (in case they changed it)
                if (!string.IsNullOrEmpty(payload.Picture) && user.AvatarUrl != payload.Picture)
                {
                    user = await _userService.UpdateUserAsync(user.Id, new UpdateUserRequest
                    {
                        AvatarUrl = payload.Picture
                    });
                }

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
            var key = Encoding.ASCII.GetBytes(_jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userId)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _jwtIssuer,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
