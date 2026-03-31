import '../styles/Header.css';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="books-header shadow-sm py-3 px-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <h1 className="h4 mb-0 fw-semibold">Book List</h1>
        <div className="d-flex align-items-center gap-2">
          <NavLink to="/" className="btn btn-sm books-header__nav-btn">
            View Book List
          </NavLink>
          <NavLink to="/cart" className="btn btn-sm books-header__nav-btn">
            View Cart
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
