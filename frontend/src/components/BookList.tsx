import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/Book';
import '../styles/BookList.css';
import { fetchBooks } from '../../api/BooksAPI';

type BookListProps = {
  selectedCategories: string[];
  pageNumber: number;
  pagesize: number;
  onTotalPages: (totalPages: number) => void;
};

function BookList({
  selectedCategories,
  pageNumber,
  pagesize,
  onTotalPages,
}: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
          setLoading(true);
          setError(null);
        const data = await fetchBooks(pageNumber, pagesize, selectedCategories);
        setBooks(data.books ?? []);
        const computedTotalPages =
          data.totalNumBooks > 0 ? Math.ceil(data.totalNumBooks / pagesize) : 1;
        onTotalPages(computedTotalPages);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [pagesize, pageNumber, selectedCategories, onTotalPages]);

  if (loading) {
    return (
      <div className="text-center text-body-secondary py-5">
        <p className="mb-0">Loading books...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-danger py-5">
        <p className="mb-0">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="row g-4">
        {books.length === 0 ? (
          <div className="col-12 text-center text-body-secondary py-5">
            <p className="mb-0">No books found for this page.</p>
          </div>
        ) : (
          books.map((b, index) => {
            return (
              <div className="col-12 col-md-6 col-xl-4" key={b.bookId || index}>
                <div className="card h-100 shadow-sm border-secondary book-card">
                  <div className="card-body d-flex flex-column">
                    <h2 className="card-title h5 text-center fw-bold mb-3">{b.title}</h2>
                    <ul className="list-unstyled mb-0 small flex-grow-1">
                      <li className="d-flex justify-content-between gap-2 py-1 border-bottom border-secondary border-opacity-25">
                        <span>Author</span>
                        <span className="text-end">{b.author}</span>
                      </li>
                      <li className="d-flex justify-content-between gap-2 py-1 border-bottom border-secondary border-opacity-25">
                        <span>Publisher</span>
                        <span className="text-end">{b.publisher}</span>
                      </li>
                      <li className="d-flex justify-content-between gap-2 py-1 border-bottom border-secondary border-opacity-25">
                        <span>ISBN</span>
                        <span className="text-end">{b.isbn}</span>
                      </li>
                      <li className="d-flex justify-content-between gap-2 py-1 border-bottom border-secondary border-opacity-25">
                        <span>Classification</span>
                        <span className="text-end">{b.classification}</span>
                      </li>
                      <li className="d-flex justify-content-between gap-2 py-1 border-bottom border-secondary border-opacity-25">
                        <span>Category</span>
                        <span className="text-end">{b.category}</span>
                      </li>
                      <li className="d-flex justify-content-between gap-2 py-1 border-bottom border-secondary border-opacity-25">
                        <span>Page Count</span>
                        <span className="text-end">{b.pageCount}</span>
                      </li>
                      <li className="d-flex justify-content-between gap-2 py-1 border-bottom border-secondary border-opacity-25">
                        <span>Price</span>
                        <span className="text-end fw-semibold">${b.price.toFixed(2)}</span>
                      </li>
                    </ul>

                    <button
                      className="btn btn-primary mt-3"
                      onClick={() => navigate('/addToCart', { state: { book: b } })}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default BookList;
