using Amazon.DynamoDBv2.Model;
using Microsoft.AspNetCore.Mvc;
using ranking_website.Models.List;
using ranking_website.Services.List;
using System.Collections.Generic;

namespace ranking_website.Controllers
{
    [ApiController]
    [Route("sigma/api/lists/{listId}/items")]
    public class ListItemsController(IListService listService) : ControllerBase
    {
        private readonly IListService _listService = listService;

        // GET /api/lists/{listId}/items - Get all items in a list
        [HttpGet]
        public async Task<ActionResult<List<ListItem>>> GetListItems(string listId)
        {
            try
            {
                var items = await _listService.GetListItemsAsync(listId);
                List<ListItem> sortedItems = [..items.OrderBy(item => item.Rank)];
                return Ok(sortedItems);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving list items: {ex.Message}");
            }
        }

        // POST /api/lists/{listId}/items - Add item to list
        [HttpPost]
        public async Task<ActionResult<ListItem>> AddItem(string listId, [FromBody] AddListItemRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Name))
                {
                    return BadRequest("Name is required");
                }

                var item = await _listService.AddItemAsync(listId, request.Name);
                return CreatedAtAction(nameof(GetListItems), new { listId }, item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error adding item: {ex.Message}");
            }
        }

        // DELETE /api/lists/{listId}/items/{itemId} - Delete item from list
        [HttpDelete("{itemId}")]
        public async Task<ActionResult> DeleteItem(string listId, string itemId)
        {
            try
            {
                var success = await _listService.DeleteItemAsync(listId, itemId);
                if (!success)
                {
                    return NotFound($"Item {itemId} not found in list {listId}");
                }
                return NoContent(); // 204 No Content
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error removing item: {ex.Message}");
            }
        }

        // PATCH /api/lists/{listId}/items/{itemId} - Update item (e.g., rank, name)
        [HttpPatch("{itemId}")]
        public async Task<ActionResult<ListItem>> UpdateItem(
            string listId,
            string itemId,
            [FromBody] UpdateListItemRequest request)
        {
            try
            {
                var item = await _listService.UpdateItemAsync(listId, itemId, request);
                if (item == null)
                {
                    return NotFound($"Item {itemId} not found in list {listId}");
                }
                return Ok(item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating item: {ex.Message}");
            }
        }
    }
}