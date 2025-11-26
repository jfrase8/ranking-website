namespace ranking_website.Models
{
    public class ListItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = "";
    }
}
