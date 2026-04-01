import { useState } from 'react';
import type { Book } from '../types/Book';
import { addBook, updateBook } from '../../api/BooksAPI';
import '../styles/NewBookForm.css';

interface NewBookFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialBook?: Book | null;
}

const NewBookForm = ({ onSuccess, onCancel, initialBook = null }: NewBookFormProps) => {
  const [formData, setFormData] = useState<Book>(
    initialBook ?? {
      bookId: 0,
      title: '',
      author: '',
      publisher: '',
      isbn: '',
      classification: '',
      category: '',
      pageCount: 0,
      price: 0,
    },
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditMode = initialBook !== null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    try {
      const bookPayload: Omit<Book, 'bookId'> = {
        title: formData.title,
        author: formData.author,
        publisher: formData.publisher,
        isbn: formData.isbn,
        classification: formData.classification,
        category: formData.category,
        pageCount: Number(formData.pageCount),
        price: Number(formData.price),
        quantity: formData.quantity,
      };
      if (isEditMode) {
        await updateBook({ ...bookPayload, bookId: formData.bookId });
      } else {
        await addBook(bookPayload);
      }
      onSuccess();
    } catch (error) {
      setSubmitError((error as Error).message);
    }
  };


  return (
    <div className="new-book-form-wrapper card shadow-sm border-secondary mb-4">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <h2 className="h5 mb-3">{isEditMode ? 'Edit Book' : 'Add New Book'}</h2>
          {submitError && <p className="text-danger mb-3">{submitError}</p>}

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label mb-1">Title</label>
              <input className="form-control" type="text" name="title" value={formData.title} onChange={handleChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label mb-1">Author</label>
              <input className="form-control" type="text" name="author" value={formData.author} onChange={handleChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label mb-1">Publisher</label>
              <input className="form-control" type="text" name="publisher" value={formData.publisher} onChange={handleChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label mb-1">ISBN</label>
              <input className="form-control" type="text" name="isbn" value={formData.isbn} onChange={handleChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label mb-1">Classification</label>
              <input className="form-control" type="text" name="classification" value={formData.classification} onChange={handleChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label mb-1">Category</label>
              <input className="form-control" type="text" name="category" value={formData.category} onChange={handleChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label mb-1">Page Count</label>
              <input className="form-control" type="number" name="pageCount" value={formData.pageCount} onChange={handleChange} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label mb-1">Price</label>
              <input className="form-control" type="number" name="price" value={formData.price} onChange={handleChange} />
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-primary" type="submit">
              {isEditMode ? 'Update Book' : 'Add Book'}
            </button>
            <button className="btn btn-outline-light" type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBookForm;
