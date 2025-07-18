"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "./SessionContext";
import jwt_decode from "jwt-decode";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { token } = useSession();

  // Helper to get userId from JWT token
  const getUserId = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwt_decode(token);
          return decoded.userId;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  };

  // Fetch cart from backend on mount or when userId changes
  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;
    fetch(`/api/cart?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.items) setCart(data.items);
      });
  }, [token]);

  // Persist cart to backend
  const persistCart = (items) => {
    const userId = getUserId();
    if (!userId) return;
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, items }),
    });
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...prev, { ...product, quantity: 1 }];
      }
      persistCart(updated);
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      persistCart(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    persistCart([]);
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const incrementQuantity = (id) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      persistCart(updated);
      return updated;
    });
  };

  const decrementQuantity = (id) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      );
      persistCart(updated);
      return updated;
    });
  };

  const setQuantity = (id, quantity) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      persistCart(updated);
      return updated;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getTotal, incrementQuantity, decrementQuantity, setQuantity }}>
      {children}
    </CartContext.Provider>
  );
}; 