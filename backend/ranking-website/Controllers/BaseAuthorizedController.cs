using Microsoft.AspNetCore.Mvc;
using ranking_website.Services.List;
using System.Security.Claims;

namespace ranking_website.Controllers
{
    public abstract class BaseAuthorizedController(IListService listService) : ControllerBase
    {
        protected readonly IListService _listService = listService;

        // Helper method to get userId from JWT token (nullable for anonymous users)
        protected string? GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        // Helper method to verify list access (public or owned)
        protected async Task<(bool canAccess, Models.List.List? list)> VerifyListAccess(
            string listId,
            bool requireOwnership = false)
        {
            var list = await _listService.GetListAsync(listId);

            if (list == null)
            {
                return (false, null);
            }

            var userId = GetUserId() ?? throw new UnauthorizedAccessException("User ID not found in token");

            if (requireOwnership)
            {
                // For modifications - must be owner
                return (list.UserId == userId, list);
            }
            else
            {
                // For viewing - can be public or owned
                return (list.Privacy == "public" || list.UserId == userId, list);
            }
        }
    }
}