import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CartItem } from '../types/CartItem';
import type { Book } from '../types/Book';

type CartContextType = {
  cart: CartItem[];
  userCredit: number;
  addBookToCart: (book: Book) => void;
  removeBookFromCart: (bookId: number) => void;
  removeOneFromCart: (bookId: number) => void;
  clearCart: () => void;
  checkoutCart: () => void;
  getQuantityInCart: (bookId: number) => number;
  getCartTotal: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userCredit, setUserCredit] = useState<number>(0);

  const addBookToCart = (book: Book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.bookId === book.bookId);

      if (existingItem) {
        return prevCart.map((item) =>
          item.bookId === book.bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...prevCart,
        {
          bookId: book.bookId,
          title: book.title,
          price: book.price,
          quantity: 1,
        },
      ];
    });
  };

  const removeBookFromCart = (bookId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.bookId !== bookId));
  };

  const removeOneFromCart = (bookId: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.bookId === bookId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkoutCart = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (total <= 0) {
      return;
    }
    setUserCredit((prev) => prev + total * 0.1);
    setCart([]);
  };

  const getQuantityInCart = (bookId: number) => {
    const item = cart.find((cartItem) => cartItem.bookId === bookId);
    return item?.quantity ?? 0;
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const value = useMemo(
    () => ({
      cart,
      userCredit,
      addBookToCart,
      removeBookFromCart,
      removeOneFromCart,
      clearCart,
      checkoutCart,
      getQuantityInCart,
      getCartTotal,
    }),
    [cart, userCredit],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
