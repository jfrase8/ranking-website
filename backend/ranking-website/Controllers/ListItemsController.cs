using Amazon.DynamoDBv2.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ranking_website.Models.List;
using ranking_website.Services.List;
using System.Collections.Generic;
using System.Security.Claims;

namespace ranking_website.Controllers
{
    [ApiController]
    [Route("sigma/api/lists/{listId}/items")]
    public class ListItemsController(IListService listService) : BaseAuthorizedController(listService)
    {
        // GET /api/lists/{listId}/items - Get all items in a list
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<ListItem>>> GetListItems(string listId)
        {
            try
            {
                Console.WriteLine($"GetListItems called with listId: {listId}");

                var (canAccess, list) = await VerifyListAccess(listId);
                Console.WriteLine($"VerifyListAccess completed. canAccess: {canAccess}, list: {list?.Id}");

                if (!canAccess)
                {
                    if (list == null)
                    {
                        return NotFound($"List {listId} not found");
                    }
                    return Forbid();
                }

                Console.WriteLine("About to call GetListItemsAsync");
                var items = await _listService.GetListItemsAsync(listId) ?? [];
                Console.WriteLine($"GetListItemsAsync returned {items.Count} items");

                List<ListItem> sortedItems = [.. items.OrderBy(item => item.Rank)];
                return Ok(sortedItems);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"EXCEPTION in GetListItems: {ex.GetType().Name}");
                Console.WriteLine($"Message: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"Error retrieving list items: {ex.Message}");
            }
        }

        // POST /api/lists/{listId}/items - Add item to list
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ListItem>> AddItem(string listId, [FromBody] AddListItemRequest request)
        {
            try
            {
                var (canAccess, list) = await VerifyListAccess(listId, true);

                if (!canAccess)
                {
                    if (list == null)
                    {
                        return NotFound($"List {listId} not found");
                    }
                    return Forbid(); // Not the owner
                }

                if (string.IsNullOrEmpty(request.Name))
                {
                    return BadRequest("Name is required");
                }

                var item = await _listService.AddItemAsync(listId, request.Name);
                return CreatedAtAction(nameof(GetListItems), new { listId }, item);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error adding item: {ex.Message}");
            }
        }

        // DELETE /api/lists/{listId}/items/{itemId} - Delete item from list
        [HttpDelete("{itemId}")]
        [Authorize]
        public async Task<ActionResult> DeleteItem(string listId, string itemId)
        {
            try
            {
                var (canAccess, list) = await VerifyListAccess(listId, true);

                if (!canAccess)
                {
                    if (list == null)
                    {
                        return NotFound($"List {listId} not found");
                    }
                    return Forbid(); // Not the owner
                }
                var success = await _listService.DeleteItemAsync(listId, itemId);
                if (!success)
                {
                    return NotFound($"Item {itemId} not found in list {listId}");
                }
                return NoContent(); // 204 No Content
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error removing item: {ex.Message}");
            }
        }

        // PATCH /api/lists/{listId}/items/{itemId} - Update item (e.g., rank, name)
        [HttpPatch("{itemId}")]
        [Authorize]
        public async Task<ActionResult<ListItem>> UpdateItem(
            string listId,
            string itemId,
            [FromBody] UpdateListItemRequest request)
        {
            try
            {
                var (canAccess, list) = await VerifyListAccess(listId, true);

                if (!canAccess)
                {
                    if (list == null)
                    {
                        return NotFound($"List {listId} not found");
                    }
                    return Forbid(); // Not the owner
                }

                var item = await _listService.UpdateItemAsync(listId, itemId, request);
                if (item == null)
                {
                    return NotFound($"Item {itemId} not found in list {listId}");
                }
                return Ok(item);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating item: {ex.Message}");
            }
        }
    }
}