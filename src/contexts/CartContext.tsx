"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
  rental_days: number;
  start_date: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, rental_days: number, start_date: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateRentalDays: (productId: string, rental_days: number) => void;
  updateStartDate: (productId: string, start_date: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) setItems(JSON.parse(savedCart));
    } catch (error) {
      console.error("Error loading cart:", error);
    }
    setHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes (skip initial render before hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items, hydrated]);

  const addToCart = (product: Product, quantity: number, rental_days: number, start_date: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      
      if (existingIndex > -1) {
        // Update existing item
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity,
          rental_days,
          start_date,
        };
        return updated;
      }
      
      // Add new item
      return [...prev, { product, quantity, rental_days, start_date }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateRentalDays = (productId: string, rental_days: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, rental_days } : item
      )
    );
  };

  const updateStartDate = (productId: string, start_date: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, start_date } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce((sum, item) => {
    return sum + (item.product.price_per_day * item.quantity * item.rental_days);
  }, 0);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateRentalDays,
    updateStartDate,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
