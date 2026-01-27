using Amazon.DynamoDBv2.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ranking_website.Models.List;
using ranking_website.Models.User;
using ranking_website.Services.List;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace ranking_website.Controllers
{
    [ApiController]
    [Route("sigma/api/lists")]
    public class ListsController(IListService listService) : BaseAuthorizedController(listService)
    {
        // GET /api/lists - Get all the lists from a user
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<List>>> GetLists()
        {
            try
            {
                var userId = GetUserId() ?? throw new UnauthorizedAccessException("User ID not found in token");
                var lists = await _listService.GetUserListsAsync(userId);
                // TODO: Add lastEdited date to list so they can be sorted
                //List<List> sortedItems = [.. items.OrderBy(item => item.Rank)];
                return Ok(lists);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving user's lists: {ex.Message}");
            }
        }

        // GET /api/lists/{listId} - Get list metadata
        [HttpGet("{listId}")]
        [AllowAnonymous]
        public async Task<ActionResult<List>> GetList(string listId)
        {
            try
            {
                var (canAccess, list) = await VerifyListAccess(listId);

                if (!canAccess)
                {
                    if (list == null)
                    {
                        return NotFound($"List {listId} not found");
                    }
                    return Forbid();
                }

                return Ok(list);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving list: {ex.Message}");
            }
        }

        // POST /api/lists - Create a new list
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<List>> CreateList([FromBody] CreateListRequest request)
        {
            try
            {
                var userId = GetUserId() ?? throw new UnauthorizedAccessException("User ID not found in token");

                if (string.IsNullOrEmpty(request.Name))
                {
                    return BadRequest("List name is required");
                }

                var list = await _listService.CreateListAsync(request, userId);
                return CreatedAtAction(nameof(GetList), new { listId = list.Id }, list);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating list: {ex.Message}");
            }
        }

        // PATCH /api/lists/{listId} - Update list metadata
        [HttpPatch("{listId}")]
        [Authorize]
        public async Task<ActionResult<List>> UpdateList(string listId, [FromBody] UpdateListRequest request)
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
                    return Forbid();
                }

                var updatedList = await _listService.UpdateListAsync(listId, request);
                return Ok(updatedList);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating list: {ex.Message}");
            }
        }

        // DELETE /api/lists/{listId} - Delete a list
        [HttpDelete("{listId}")]
        [Authorize]
        public async Task<ActionResult> DeleteList(string listId)
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
                    return Forbid();
                }

                await _listService.DeleteListAsync(listId);
                return NoContent(); // 204 No Content is standard for successful DELETE
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting list: {ex.Message}");
            }
        }
    }
}