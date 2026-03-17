import { useEffect, useState } from 'react';
import type { Book } from './types/Book';
import 'bootstrap/dist/css/bootstrap.min.css';

const pageBackground = {
    backgroundColor: '#181c2f', // dark background
    minHeight: '100vh',
    width: '100vw',
    color: '#f8f9fa'
};

const navyAccent = {
    backgroundColor: '#22336b',
    color: '#f8f9fa'
};

function BookList() {
    const [pagesize, setPagesize] = useState<number>(10);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalBooks, setTotalBooks] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [books, setBooks] = useState<Book[]>([]);
    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(`https://localhost:5000/Bookstore/AllBooks?PageSize=${pagesize}&PageNumber=${pageNumber}`);
            const data = await response.json();
            setBooks(data.books); // lowercase 'books'
            setTotalBooks(data.totalNumBooks);
            setTotalPages(data.totalNumBooks > 0 ? Math.ceil(data.totalNumBooks / pagesize) : 1);
        };
        fetchBooks();
    }, [pagesize, pageNumber]); // Only pagesize and pageNumber

    return (
        <div style={pageBackground}>
            <div className="container py-4">
                <h1 className="mb-4 p-3 rounded" style={navyAccent}>Book List</h1>
                <div className="row g-4">
                    {books.length === 0 ? (
                        <div className="col-12 text-center">
                            <p>No books found for this page.</p>
                        </div>
                    ) : (
                        books.map(b => (
                            <div className="col-12 col-md-6 col-lg-4" key={b.bookId}>
                                <div className="card h-100 shadow" style={{ backgroundColor: '#23284a', color: '#f8f9fa', border: '1px solid #22336b' }}>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title text-center fw-bold mb-3" style={{ color: '#7ea2ff' }}>
                                            {b.title}
                                        </h5>
                                        <ul className="list-unstyled mb-0">
                                            <li className="d-flex justify-content-between">
                                                <span><strong>Author:</strong></span>
                                                <span className="text-end">{b.author}</span>
                                            </li>
                                            <li className="d-flex justify-content-between">
                                                <span><strong>Publisher:</strong></span>
                                                <span className="text-end">{b.publisher}</span>
                                            </li>
                                            <li className="d-flex justify-content-between">
                                                <span><strong>ISBN:</strong></span>
                                                <span className="text-end">{b.isbn}</span>
                                            </li>
                                            <li className="d-flex justify-content-between">
                                                <span><strong>Classification:</strong></span>
                                                <span className="text-end">{b.classification}</span>
                                            </li>
                                            <li className="d-flex justify-content-between">
                                                <span><strong>Category:</strong></span>
                                                <span className="text-end">{b.category}</span>
                                            </li>
                                            <li className="d-flex justify-content-between">
                                                <span><strong>Page Count:</strong></span>
                                                <span className="text-end">{b.pageCount}</span>
                                            </li>
                                            <li className="d-flex justify-content-between">
                                                <span><strong>Price:</strong></span>
                                                <span className="text-end">${b.price}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <br />
                <div>
                    <button
                        disabled={pageNumber === 1}
                        onClick={() => setPageNumber(pageNumber - 1)}                    
                    >Previous</button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setPageNumber(i + 1)}
                            disabled={pageNumber === i + 1}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={pageNumber === totalPages}
                        onClick={() => setPageNumber(pageNumber + 1)}
                    >
                        Next
                    </button>

                    <br />
                    <br />

                    <label>
                        Results per page:
                        <select
                            value={pagesize}
                            onChange={p => {
                                setPagesize(Number(p.target.value));
                                setPageNumber(1);
                            }}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default BookList;