import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/Book';
import '../styles/BookList.css';

type BookListProps = {
  selectedCategories: string[];
  pageNumber: number;
  pagesize: number;
  onTotalPages: (totalPages: number) => void;
};

type RawBook = Partial<Book> & {
  bookID?: number;
  id?: number;
  quantity?: number;
  inventory?: number;
};

function normalizeBook(raw: RawBook): Book {
  return {
    bookId: raw.bookId ?? raw.bookID ?? raw.id ?? 0,
    title: raw.title ?? '',
    author: raw.author ?? '',
    publisher: raw.publisher ?? '',
    isbn: raw.isbn ?? '',
    classification: raw.classification ?? '',
    category: raw.category ?? '',
    pageCount: raw.pageCount ?? 0,
    price: raw.price ?? 0,
    quantity: raw.quantity ?? raw.inventory ?? 1,
  };
}

function BookList({
  selectedCategories,
  pageNumber,
  pagesize,
  onTotalPages,
}: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((c) => `bookTypes=${encodeURIComponent(c)}`)
        .join('&');

      const response = await fetch(
        `https://localhost:5000/Bookstore/AllBooks?PageSize=${pagesize}&PageNumber=${pageNumber}${selectedCategories.length > 0 ? `&${categoryParams}` : ''}`,
      );
      const data = await response.json();
      const normalizedBooks: Book[] = (data.books ?? []).map((raw: RawBook) =>
        normalizeBook(raw),
      );
      setBooks(normalizedBooks);
      const computedTotalPages =
        data.totalNumBooks > 0 ? Math.ceil(data.totalNumBooks / pagesize) : 1;
      onTotalPages(computedTotalPages);
    };

    fetchBooks();
  }, [pagesize, pageNumber, selectedCategories, onTotalPages]);

  return (
    <div>
      <div className="row g-4">
        {books.length === 0 ? (
          <div className="col-12 text-center text-body-secondary py-5">
            <p className="mb-0">No books found for this page.</p>
          </div>
        ) : (
          books.map((b) => {
            return (
              <div className="col-12 col-md-6 col-xl-4" key={b.bookId}>
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
