import { useEffect, useState } from 'react';
import type { Book } from './types/Book';

function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch('https://localhost:5000/Bookstore/AllBooks');
            const data = await response.json();
            setBooks(data);
        };
        fetchBooks();
    }, []);

    return (
        <>
            <div>
                <h1>Book List</h1>
                <br />
                <table border={1} style={{ marginBottom: '20px', width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Publisher</th>
                            <th>ISBN</th>
                            <th>Classification</th>
                            <th>Category</th>
                            <th>Page Count</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(b => (
                            <tr key={b.bookId}>
                                <td>{b.title}</td>
                                <td>{b.author}</td>
                                <td>{b.publisher}</td>
                                <td>{b.isbn}</td>
                                <td>{b.classification}</td>
                                <td>{b.category}</td>
                                <td>{b.pageCount}</td>
                                <td>${b.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default BookList;