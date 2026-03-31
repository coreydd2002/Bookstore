import { useCart } from '../context/CartContext';
import '../styles/UserCredit.css';

function UserCredit() {
  const { userCredit } = useCart();

  return (
    <div className="user-credit-panel">
      <h2 className="h6 text-uppercase text-body-secondary fw-semibold mb-3">
        Store Credit
      </h2>
      <p className="small mb-2">
        For every book you buy, you get 10% cashback in store credit!
      </p>
      <p className="mb-0 fw-semibold">Your credit: ${userCredit.toFixed(2)}</p>
    </div>
  );
}

export default UserCredit;
