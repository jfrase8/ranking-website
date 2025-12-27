
using ranking_website.Models.List;

namespace ranking_website.Services.List
{
    public interface IListService
    {
        Task<Models.List.List?> GetListAsync(string listId);
        Task<List<ListItem>> GetListItemsAsync(string listId);
        Task<Models.List.List> CreateListAsync(CreateListRequest request);
        Task<Models.List.List?> UpdateListAsync(string listID, UpdateListRequest request);
        Task<bool> DeleteListAsync(string listID);
        Task<ListItem> AddItemAsync(string listId, string itemName);
        Task<bool> RemoveItemAsync(string listId, string itemId);
        Task<List<ListItem>> UpdateItemAsync(string listId, string itemId, UpdateListItemRequest request);
    }
}
