"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
  rental_days: number;
  start_date: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    rental_days: number,
    start_date: string,
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateRentalDays: (productId: string, rental_days: number) => void;
  updateStartDate: (productId: string, start_date: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  showFlash: (message: string, variant?: "success" | "error") => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [flash, setFlash] = useState<{
    id: number;
    message: string;
    variant: "success" | "error";
  } | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) setItems(JSON.parse(savedCart));
    } catch (error) {
      console.error("Error loading cart:", error);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  const showFlash = useCallback(
    (message: string, variant: "success" | "error" = "success") => {
      setFlash({ id: Date.now(), message, variant });
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => setFlash(null), 2500);
    },
    [],
  );

  const addToCart = (
    product: Product,
    quantity: number,
    rental_days: number,
    start_date: string,
  ) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id,
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity,
          rental_days,
          start_date,
        };
        return updated;
      }

      return [...prev, { product, quantity, rental_days, start_date }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const updateRentalDays = (productId: string, rental_days: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, rental_days } : item,
      ),
    );
  };

  const updateStartDate = (productId: string, start_date: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, start_date } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    return (
      sum + item.product.price_per_day * item.quantity * item.rental_days
    );
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
    showFlash,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {flash && (
          <motion.div
            key={flash.id}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl max-w-[calc(100vw-2rem)] text-sm font-medium ${
              flash.variant === "success"
                ? "bg-gray-900 text-white"
                : "bg-red-600 text-white"
            }`}
            role="status"
            aria-live="polite"
          >
            {flash.variant === "success" ? (
              <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="line-clamp-2">{flash.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
