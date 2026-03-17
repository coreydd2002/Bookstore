using Bookstore.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Bookstore.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookstoreController : ControllerBase
    {
        private BookDbContext _bookcontext;
        public BookstoreController(BookDbContext temp) => _bookcontext = temp;

        [HttpGet("AllBooks")]
        public IActionResult GetBooks([FromQuery] int PageSize = 10, [FromQuery] int PageNumber = 1)
        {
            if (PageSize <= 0 || PageNumber <= 0)
            {
                return BadRequest("PageSize and PageNumber must be greater than 0");
            }

            var page = _bookcontext.Books
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ToList();

            var totalNumBooks = _bookcontext.Books.Count();

            return Ok(new
            {
                books = page,
                totalNumBooks = totalNumBooks
            });
        }

        [HttpGet("FictionalBooks")]

        public IEnumerable<Book> GetFictionalBooks()
        {
            var fictional = _bookcontext.Books.Where(p => p.Classification == "Fiction");
            return fictional.ToList();
        }
    }
}
