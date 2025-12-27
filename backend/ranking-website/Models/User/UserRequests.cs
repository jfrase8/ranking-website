namespace ranking_website.Models.User
{
    public class CreateUserRequest
    {
        public required string UserName { get; set; }
        public required string Password { get; set; }
        public string? Email { get; set; }
    }
    public class UpdateUserRequest
    {
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? AvatarUrl { get; set; }

    }
}
