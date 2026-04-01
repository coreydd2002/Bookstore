import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';
import { deleteBook, fetchBooks } from '../../api/BooksAPI';
import PageOptions from '../components/PageOptions';
import NewBookForm from '../components/NewBookForm';
import '../styles/AdminBooksPage.css';

type AdminBook = Book & { bookID?: number; id?: number };

const normalizeBookId = (book: AdminBook, index: number): number =>
  book.bookId ?? book.bookID ?? book.id ?? index;

const AdminBooksPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState<Book[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pagesize, setPagesize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    const loadBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchBooks(pageNumber, pagesize, []);
            setBooks(data.books as AdminBook[]);
            setTotalPages(Math.max(1, Math.ceil(data.totalNumBooks / pagesize)));
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBooks();
    }, [pageNumber, pagesize]);

    const closeForm = () => {
        setShowForm(false);
        setEditingBook(null);
    };

    const handleDelete = async (bookId: number) => {
        try {
            await deleteBook(bookId);
            await loadBooks();
        } catch (error) {
            setError((error as Error).message);
        }
    };

    if (loading) {
        return <div className="container py-4 text-body-secondary">Loading...</div>;
    }
    if (error) {
        return <div className="container py-4 text-danger">Error: {error}</div>;
    }
    return (
        <div className="container py-4 admin-books-page">
            <h1 className="h3 mb-3">Admin Books Page</h1>
            <PageOptions
                pageNumber={pageNumber}
                totalPages={totalPages}
                pagesize={pagesize}
                onPageChange={setPageNumber}
                onPagesizeChange={(size) => {
                setPagesize(size);
                setPageNumber(1);
            }}
            />

            {showForm && (
                <NewBookForm 
                    onSuccess={() => {
                        closeForm();
                        loadBooks();
                    }}
                    onCancel={closeForm}
                    initialBook={editingBook}
                />
            )}
            
            <button
                className="btn btn-primary mb-3"
                onClick={() => {
                    setEditingBook(null);
                    setShowForm(true);
                }}
            >
                Add New Book
            </button>

            <div className="table-responsive">
            <table className="table table-dark table-striped table-hover align-middle admin-books-table">
                <thead>
                    <tr>
                        <th>Book ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>ISBN</th>
                        <th>Classification</th>
                        <th>Category</th>
                        <th>Page Count</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book, index) => (
                        <tr key={normalizeBookId(book as AdminBook, index)}>
                            <td>{book.bookId}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.publisher}</td>
                            <td>{book.isbn}</td>
                            <td>{book.classification}</td>
                            <td>{book.category}</td>
                            <td>{book.pageCount}</td>
                            <td>${book.price.toFixed(2)}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-outline-info me-2"
                                    onClick={() => {
                                        setEditingBook(book);
                                        setShowForm(true);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(book.bookId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    )
};
export default AdminBooksPage;
