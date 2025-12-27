namespace ranking_website.Models.List
{
    public class List
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string UserId { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
