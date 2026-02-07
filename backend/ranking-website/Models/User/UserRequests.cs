namespace ranking_website.Models.User
{
    public class GoogleLoginRequest
    {
        public required string IdToken { get; set; }
    }
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public User User { get; set; } = null!;
    }
    public class CreateUserRequest
    {
        public required string Id { get; set; }
        public required string UserName { get; set; }
        public string? Email { get; set; }
    }
    public class UpdateUserRequest
    {
        public string? UserName { get; set; }
        public string? AvatarUrl { get; set; }
    }
}
