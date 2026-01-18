using ranking_website.Models.User;

namespace ranking_website.Services.Auth
{
    public interface IAuthService
    {
        Task<AuthResponse> VerifyGoogleTokenAsync(string idToken);
    }
}
