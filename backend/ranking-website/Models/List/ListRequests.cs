namespace ranking_website.Models.List
{
    public class CreateListRequest
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public required string UserId { get; set; }
    }

    public class UpdateListRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
    }

    public class AddListItemRequest
    {
        public required string ItemName { get; set; }
    }

    public class UpdateListItemRequest
    {
        public string? ItemName { get; set; }
        public int? Rank { get; set; }
    }

    public class DeleteListItemRequest
    {
        public required string ListId { get; set; }
        public required string ItemId { get; set; }
    }
}
