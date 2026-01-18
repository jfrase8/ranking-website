namespace ranking_website.Models.User
{
    public class User
    {
        public required string Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public required string UserName { get; set; }
        public string? Email { get; set; }
        public string? AvatarUrl { get; set; }
    }
}
