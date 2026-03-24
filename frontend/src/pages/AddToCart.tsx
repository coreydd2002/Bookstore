import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Book } from '../types/Book';
import '../styles/AddToCart.css';

function AddToCart() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addBookToCart, removeOneFromCart, getQuantityInCart } = useCart();
  const selectedBook = (location.state as { book?: Book } | null)?.book;
  const addedBookIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (selectedBook && addedBookIdRef.current !== selectedBook.bookId) {
      addBookToCart(selectedBook);
      addedBookIdRef.current = selectedBook.bookId;
    }
  }, [selectedBook, addBookToCart]);

  if (!selectedBook) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning mb-3">No book selected.</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  const quantityInCart = getQuantityInCart(selectedBook.bookId);

  return (
    <div className="container py-4 add-to-cart-page">
      <div className="card border-secondary add-to-cart-card">
        <div className="card-body">
          <h2 className="h4 mb-3">Adding '{selectedBook.title}' to your cart.</h2>
          <p className="mb-2">Price: ${selectedBook.price.toFixed(2)}</p>
          <p className="text-body-secondary mb-4">Quantity in cart: {quantityInCart}</p>

          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                removeOneFromCart(selectedBook.bookId);
                navigate('/');
              }}
              disabled={quantityInCart === 0}
            >
              Remove From Cart
            </button>
            <button className="btn btn-dark" onClick={() => navigate('/cart')}>
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddToCart;
