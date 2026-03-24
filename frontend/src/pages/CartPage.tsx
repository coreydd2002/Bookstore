import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import UserCredit from '../components/UserCredit';
import '../styles/BooksPage.css';
import '../styles/CartPage.css';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeOneFromCart, clearCart, checkoutCart, getCartTotal } = useCart();

  return (
    <div className="app-body cart-page">
      <aside className="app-sidebar bg-body-secondary">
        <div className="p-3 p-lg-4 h-100">
          <UserCredit />
        </div>
      </aside>

      <main className="app-main-scroll">
        <div className="p-3 p-lg-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 mb-0">Your Cart</h2>
            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={checkoutCart} disabled={cart.length === 0}>
                Checkout
              </button>
              <button className="btn btn-outline-danger" onClick={clearCart}>
                Clear Cart
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Continue Shopping
              </button>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="alert alert-secondary">Your cart is empty.</div>
          ) : (
            <>
              <div className="row g-4">
                {cart.map((item) => (
                  <div className="col-12 col-md-6 col-xl-4" key={item.bookId}>
                    <div className="card h-100 shadow-sm border-secondary book-card">
                      <div className="card-body d-flex flex-column">
                        <h3 className="card-title h5 text-center fw-bold mb-3">{item.title}</h3>
                        <ul className="list-unstyled mb-3 small flex-grow-1">
                          <li className="d-flex justify-content-between py-1 border-bottom border-secondary border-opacity-25">
                            <span>Price</span>
                            <span>${item.price.toFixed(2)}</span>
                          </li>
                          <li className="d-flex justify-content-between py-1 border-bottom border-secondary border-opacity-25">
                            <span>Quantity</span>
                            <span>{item.quantity}</span>
                          </li>
                          <li className="d-flex justify-content-between py-1 fw-semibold">
                            <span>Line Total</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        </ul>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => removeOneFromCart(item.bookId)}
                        >
                          Remove Book
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-top border-secondary d-flex justify-content-end">
                <h3 className="h5 mb-0">Total: ${getCartTotal().toFixed(2)}</h3>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default CartPage;
