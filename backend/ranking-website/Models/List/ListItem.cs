namespace ranking_website.Models.List
{
    public class ListItem
    {
        public required string Id { get; set; }
        public required string ListId { get; set; }
        public required string Name { get; set; }
        public int Rank { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}