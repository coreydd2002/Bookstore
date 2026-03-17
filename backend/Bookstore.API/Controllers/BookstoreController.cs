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
        public IEnumerable<Book> GetBooks()
        {
            return _bookcontext.Books.ToList();
        }

        [HttpGet("FictionalBooks")]

        public IEnumerable<Book> GetFictionalBooks()
        {
            var fictional = _bookcontext.Books.Where(p => p.Classification == "Fiction");
            return fictional.ToList();
        }
    }
}
