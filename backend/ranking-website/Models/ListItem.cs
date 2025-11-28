namespace ranking_website.Models
{
    public class ListItem
    {
        public string ListId { get; set; } = string.Empty;
        public string ItemId { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class AddItemRequest
    {
        public string ListId { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
    }

    public class RemoveItemRequest
    {
        public string ListId { get; set; } = string.Empty;
        public string ItemId { get; set; } = string.Empty;
    }
}