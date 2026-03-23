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
        public IActionResult GetBooks([FromQuery] int PageSize = 10, [FromQuery] int PageNumber = 1, [FromQuery] List<string>? bookTypes = null)
        {
            var query = _bookcontext.Books.AsQueryable();
            if (bookTypes != null && bookTypes.Any())
            {
                query = query.Where(p => bookTypes.Contains(p.Category));
            }

            if (PageSize <= 0 || PageNumber <= 0)
            {
                return BadRequest("PageSize and PageNumber must be greater than 0");
            }

            var totalNumBooks = query.Count();

            var page = query
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ToList();


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

        [HttpGet("BookCategories")]
        public IActionResult GetBookCategory()
        {
            var bookTypes = _bookcontext.Books
            .Select(p => p.Category)
            .Distinct()
            .ToList();

            return Ok(bookTypes);

        }
    }
}
