using Amazon.DynamoDBv2.Model;
using Microsoft.AspNetCore.Mvc;
using ranking_website.Models.List;
using ranking_website.Services.List;
using System.Collections.Generic;

namespace ranking_website.Controllers
{
    [ApiController]
    [Route("sigma/api/lists")]
    public class ListsController(IListService listService) : ControllerBase
    {
        private readonly IListService _listService = listService;

        // GET /api/lists/{listId} - Get list metadata
        [HttpGet("{listId}")]
        public async Task<ActionResult<List>> GetList(string listId)
        {
            try
            {
                var list = await _listService.GetListAsync(listId);
                if (list == null)
                {
                    return NotFound($"List {listId} not found");
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving list: {ex.Message}");
            }
        }

        // POST /api/lists - Create a new list
        [HttpPost]
        public async Task<ActionResult<List>> CreateList([FromBody] CreateListRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Name))
                {
                    return BadRequest("List name is required");
                }

                var list = await _listService.CreateListAsync(request);
                return CreatedAtAction(nameof(GetList), new { listId = list.Id }, list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating list: {ex.Message}");
            }
        }

        // PATCH /api/lists/{listId} - Update list metadata
        [HttpPatch("{listId}")]
        public async Task<ActionResult<List>> UpdateList(string listId, [FromBody] UpdateListRequest request)
        {
            try
            {
                var list = await _listService.UpdateListAsync(listId, request);
                if (list == null)
                {
                    return NotFound($"List {listId} not found");
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating list: {ex.Message}");
            }
        }

        // DELETE /api/lists/{listId} - Delete a list
        [HttpDelete("{listId}")]
        public async Task<ActionResult> DeleteList(string listId)
        {
            try
            {
                var success = await _listService.DeleteListAsync(listId);
                if (!success)
                {
                    return NotFound($"List {listId} not found");
                }
                return NoContent(); // 204 No Content is standard for successful DELETE
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting list: {ex.Message}");
            }
        }
    }
}