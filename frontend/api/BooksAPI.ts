import type { Book } from '../src/types/Book';

interface FetchBooksResponse {
  books: Book[];
  totalNumBooks: number;
}

const API_BASE = '/Bookstore';

type RawBook = Partial<Book> & {
  bookID?: number;
  id?: number;
  quantity?: number;
  inventory?: number;
};

const normalizeBook = (raw: RawBook): Book => ({
  bookId: raw.bookId ?? raw.bookID ?? raw.id ?? 0,
  title: raw.title ?? '',
  author: raw.author ?? '',
  publisher: raw.publisher ?? '',
  isbn: raw.isbn ?? '',
  classification: raw.classification ?? '',
  category: raw.category ?? '',
  pageCount: raw.pageCount ?? 0,
  price: raw.price ?? 0,
  quantity: raw.quantity ?? raw.inventory ?? undefined,
});

const parseJsonSafe = async (response: Response): Promise<any | null> => {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const fetchBooks = async (
    pageNumber: number, 
    pagesize: number,
    selectedCategories: string[]
): Promise<FetchBooksResponse> => {
    try {
        const categoryParams = selectedCategories
        .map((c) => `bookTypes=${encodeURIComponent(c)}`)
        .join('&');

        const response = await fetch(
        `${API_BASE}/AllBooks?PageSize=${pagesize}&PageNumber=${pageNumber}${selectedCategories.length > 0 ? `&${categoryParams}` : ''}`,
        );
        const data = await parseJsonSafe(response);

        if (!response.ok) {
            throw new Error(data?.message || `Failed to fetch books (${response.status})`);
        }
        return {
            books: (data?.books ?? []).map((b: RawBook) => normalizeBook(b)),
            totalNumBooks: data?.totalNumBooks ?? 0,
        };
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

export const fetchBookCategories = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE}/BookCategories`);
        const data = await parseJsonSafe(response);

        if (!response.ok) {
            throw new Error(data?.message || `Failed to fetch categories (${response.status})`);
        }
        return (data ?? []) as string[];
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const addBook = async (book: Omit<Book, 'bookId'>): Promise<Book> => {
    try {
        const response = await fetch(`${API_BASE}/Add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book),
        });
        const data = await parseJsonSafe(response);

        if (!response.ok) {
            throw new Error(data?.message || `Failed to add book (${response.status})`);
        }
        return normalizeBook((data ?? {}) as RawBook);
    } catch (error) {
        console.error('Error adding book:', error);
        throw error;
    }
};

export const updateBook = async (book: Book): Promise<Book> => {
    try {
        const response = await fetch(`${API_BASE}/Update/${book.bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(book),
        });
        const data = await parseJsonSafe(response);

        if (!response.ok) {
            throw new Error(data?.message || `Failed to update book (${response.status})`);
        }
        return normalizeBook((data ?? {}) as RawBook);
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
};

export const deleteBook = async (bookId: number): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE}/Delete/${bookId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const data = await parseJsonSafe(response);
            throw new Error(data?.message || `Failed to delete book (${response.status})`);
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
};