import { useEffect, useState } from 'react';
import type { Book } from './types/Book';

function BookList({
  selectedCategories,
  pageNumber,
  pagesize,
  onTotalPages,
}: {
  selectedCategories: string[];
  pageNumber: number;
  pagesize: number;
  onTotalPages: (totalPages: number) => void;
}) {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((c) => `bookTypes=${encodeURIComponent(c)}`)
        .join('&');

      const response = await fetch(
        `https://localhost:5000/Bookstore/AllBooks?PageSize=${pagesize}&PageNumber=${pageNumber}${selectedCategories.length > 0 ? `&${categoryParams}` : ''}`,
      );
      const data = await response.json();
      setBooks(data.books);
      const computedTotalPages =
        data.totalNumBooks > 0
          ? Math.ceil(data.totalNumBooks / pagesize)
          : 1;
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
          books.map((b) => (
            <div className="col-12 col-md-6 col-xl-4" key={b.bookId}>
              <div
                className="card h-100 shadow-sm border-secondary"
                style={{ backgroundColor: '#e5e7eb', color: '#1e3a8a' }}
              >
                <div className="card-body d-flex flex-column">
                  <h2 className="card-title h5 text-center fw-bold mb-3">
                    {b.title}
                  </h2>
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
                    <li className="d-flex justify-content-between gap-2 py-1">
                      <span>Price</span>
                      <span className="text-end fw-semibold">${b.price}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BookList;
