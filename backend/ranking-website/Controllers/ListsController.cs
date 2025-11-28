using Microsoft.AspNetCore.Mvc;
using ranking_website.Models;
using ranking_website.Services;

namespace ranking_website.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListsController(IListService listService) : ControllerBase
    {
        private readonly IListService _listService = listService;

        [HttpGet("{listId}")]
        public async Task<ActionResult<List<ListItem>>> GetList(string listId)
        {
            try
            {
                var items = await _listService.GetListItemsAsync(listId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving list: {ex.Message}");
            }
        }

        [HttpPost("add")]
        public async Task<ActionResult<ListItem>> AddItem([FromBody] AddItemRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.ListId) || string.IsNullOrEmpty(request.ItemName))
                {
                    return BadRequest("ListId and ItemName are required");
                }

                var item = await _listService.AddItemAsync(request.ListId, request.ItemName);
                return Ok(item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error adding item: {ex.Message}");
            }
        }

        [HttpDelete("remove")]
        public async Task<ActionResult> RemoveItem([FromBody] RemoveItemRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.ListId) || string.IsNullOrEmpty(request.ItemId))
                {
                    return BadRequest("ListId and ItemId are required");
                }

                var success = await _listService.RemoveItemAsync(request.ListId, request.ItemId);

                if (success)
                {
                    return Ok(new { message = "Item removed successfully" });
                }

                return NotFound("Item not found");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error removing item: {ex.Message}");
            }
        }
    }
}