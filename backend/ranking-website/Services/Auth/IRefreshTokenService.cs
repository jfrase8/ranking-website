using ranking_website.Models.Auth;

namespace ranking_website.Services.Auth
{
    public interface IRefreshTokenService
    {
        Task<RefreshToken?> GetByTokenAsync(string token);
        Task CreateAsync(RefreshToken refreshToken);
        Task UpdateAsync(RefreshToken refreshToken);
        Task RevokeAsync(string token);
        Task RevokeAllForUserAsync(string userId);
    }
}
