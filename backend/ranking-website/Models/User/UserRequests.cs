namespace ranking_website.Models.User
{
    public class GoogleLoginRequest
    {
        public required string IdToken { get; set; }
    }
    public class AuthResponse
    {
        public required string Token { get; set; }
        public required User User { get; set; }
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
