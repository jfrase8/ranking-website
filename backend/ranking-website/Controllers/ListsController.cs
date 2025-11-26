using Microsoft.AspNetCore.Mvc;
using ranking_website.Models;
using ranking_website.Services;

namespace ranking_website.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListsController(ListService listService) : ControllerBase
    {
        private readonly ListService _listService = listService;

        [HttpGet]
        public IEnumerable<ListItem> Get() => _listService.GetAll();

        [HttpPost("add")]
        public ActionResult<IEnumerable<ListItem>> Add([FromBody] string name)
        {
            try
            {
                return Ok(_listService.AddItem(name));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("update")]
        public IEnumerable<ListItem> Update([FromBody] IEnumerable<ListItem> updatedList)
        {
            return _listService.UpdateList(updatedList);
        }
    }
}
