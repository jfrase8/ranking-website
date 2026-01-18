using ranking_website.Models.User;

namespace ranking_website.Services.User
{
    public interface IUserService
    {
        Task<Models.User.User?> GetUserByIdAsync(string userId);
        Task<Models.User.User> CreateUserAsync(CreateUserRequest request);
        Task<Models.User.User?> UpdateUserAsync(string userId, UpdateUserRequest request);
    }
}
