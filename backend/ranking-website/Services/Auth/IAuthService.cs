using ranking_website.Models.User;

namespace ranking_website.Services.Auth
{
    public interface IAuthService
    {
        Task<AuthResponse> VerifyGoogleTokenAsync(string idToken);
        Task<Models.Auth.TokenResponse> RefreshTokenAsync(string refreshToken);
        Task<bool> PingActivityAsync(string refreshToken);
        Task RevokeRefreshTokenAsync(string refreshToken);
    }
}
