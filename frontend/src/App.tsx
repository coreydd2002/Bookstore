import './styles/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import AddToCart from './pages/AddToCart';
import BooksPage from './pages/BooksPage';
import CartPage from './pages/CartPage';
import Footer from './shared/Footer';
import Header from './shared/Header';
import AdminBooksPage from './pages/AdminBooksPage';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="app-shell bg-body text-body">
          <Header />
          <main className="app-main-route flex-grow-1 overflow-auto">
            <Routes>
              <Route path="/" element={<BooksPage />} />
              <Route path="/addToCart" element={<AddToCart />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/adminBooks" element={<AdminBooksPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
