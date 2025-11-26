using ranking_website.Models;

namespace ranking_website.Services
{
    public class ListService
    {
        // Temporary in-memory storage
        private readonly List<ListItem> _items = [];

        // Returns current list
        public IEnumerable<ListItem> GetAll() => _items;

        public IEnumerable<ListItem> AddItem(string name)
        {
            // Business rule: no duplicates
            if (_items.Any(x => x.Name.Equals(name, StringComparison.OrdinalIgnoreCase)))
                throw new InvalidOperationException("Item already exists");

            var newItem = new ListItem { Name = name };
            _items.Add(newItem);
            return _items;

        }

        public IEnumerable<ListItem> RemoveItem(string id)
        {
            var itemToRemove = _items.FirstOrDefault(i => i.Id == id) ?? throw new InvalidOperationException("Item not found");
            _items.Remove(itemToRemove);
            return _items;
        }

        public IEnumerable<ListItem> UpdateItem(ListItem updatedItem)
        {
            var item = _items.FirstOrDefault(i => i.Name == updatedItem.Name) ?? throw new InvalidOperationException("Item not found");
            _items.Remove(item);
            return _items;
        }
    }
}
