using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;
using ranking_website.Models.Auth;
using ranking_website.Models.User;
using ranking_website.Services.User;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ranking_website.Services.Auth
{
    public class AuthService(
        IUserService userService,
        IRefreshTokenService refreshTokenService,
        IConfiguration configuration) : IAuthService
    {
        private readonly IUserService _userService = userService;
        private readonly IRefreshTokenService _refreshTokenService = refreshTokenService;
        
        private readonly string _jwtSecret = configuration["Jwt:Secret"]
                ?? throw new InvalidOperationException("Jwt:Secret configuration is missing");
        
        private readonly string _googleClientId = configuration["Google:ClientId"]
                ?? throw new InvalidOperationException("Google:ClientId configuration is missing");
        
        private readonly string _jwtIssuer = configuration["Jwt:Issuer"] ?? "ranking-website";

        public async Task<AuthResponse> VerifyGoogleTokenAsync(string idToken)
        {
            try
            {
                // Verify Google token
                var payload = await GoogleJsonWebSignature.ValidateAsync(idToken,
                    new GoogleJsonWebSignature.ValidationSettings
                    {
                        Audience = [_googleClientId]
                    });

                // Check if user exists
                var user = await _userService.GetUserByIdAsync(payload.Subject);

                // Create user if doesn't exist
                user ??= await _userService.CreateUserAsync(new CreateUserRequest
                {
                    Id = payload.Subject,
                    UserName = payload.Name ?? payload.Email.Split('@')[0],
                    Email = payload.Email
                });

                // Update avatar if provided and different
                if (!string.IsNullOrEmpty(payload.Picture) && user.AvatarUrl != payload.Picture)
                {
                    user = await _userService.UpdateUserAsync(user.Id, new UpdateUserRequest
                    {
                        AvatarUrl = payload.Picture
                    });
                }

                if (user == null)
                    throw new Exception("User creation was unsuccessful");

                // Generate tokens
                var tokens = await GenerateTokensAsync(user.Id);

                return new AuthResponse
                {
                    Token = tokens.AccessToken,
                    RefreshToken = tokens.RefreshToken,
                    ExpiresAt = tokens.ExpiresAt,
                    User = user
                };
            }
            catch (InvalidJwtException)
            {
                throw new UnauthorizedAccessException("Invalid Google token");
            }
        }

        public async Task<TokenResponse> RefreshTokenAsync(string refreshTokenString)
        {
            var refreshToken = await _refreshTokenService.GetByTokenAsync(refreshTokenString);

            if (refreshToken == null || !refreshToken.IsActive)
            {
                throw new UnauthorizedAccessException("Invalid or expired refresh token");
            }

            // Update last activity
            refreshToken.LastActivityAt = DateTime.UtcNow;
            await _refreshTokenService.UpdateAsync(refreshToken);

            // Generate new access token (keep same refresh token)
            var accessToken = GenerateAccessToken(refreshToken.UserId);
            var expiresAt = DateTime.UtcNow.AddMinutes(15);

            return new TokenResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshTokenString, // Return same refresh token
                ExpiresAt = expiresAt
            };
        }

        public async Task<bool> PingActivityAsync(string refreshTokenString)
        {
            var refreshToken = await _refreshTokenService.GetByTokenAsync(refreshTokenString);

            if (refreshToken == null || !refreshToken.IsActive)
            {
                return false;
            }

            refreshToken.LastActivityAt = DateTime.UtcNow;
            await _refreshTokenService.UpdateAsync(refreshToken);

            return true;
        }

        public async Task RevokeRefreshTokenAsync(string refreshTokenString)
        {
            await _refreshTokenService.RevokeAsync(refreshTokenString);
        }

        private async Task<TokenResponse> GenerateTokensAsync(string userId)
        {
            var accessToken = GenerateAccessToken(userId);
            var refreshTokenString = GenerateRefreshTokenString();
            var now = DateTime.UtcNow;

            var refreshToken = new RefreshToken
            {
                Token = refreshTokenString,
                UserId = userId,
                CreatedAt = now,
                ExpiresAt = now.AddDays(7), // Absolute expiration: 7 days
                LastActivityAt = now,
                RevokedAt = null
            };

            await _refreshTokenService.CreateAsync(refreshToken);

            return new TokenResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshTokenString,
                ExpiresAt = now.AddMinutes(15)
            };
        }

        private string GenerateAccessToken(string userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSecret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                [
                    new Claim(ClaimTypes.NameIdentifier, userId)
                ]),
                Expires = DateTime.UtcNow.AddMinutes(15), // Short-lived
                Issuer = _jwtIssuer,
                NotBefore = DateTime.UtcNow,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private static string GenerateRefreshTokenString()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}
