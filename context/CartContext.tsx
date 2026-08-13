"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  scale: string;
  color: string;
  quantity: number;
  maxStock?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from MongoDB database via API
  useEffect(() => {
    async function loadCart() {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        if (data.success && data.cart) {
          const mapped = data.cart.map((item: any) => ({
            id: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            scale: item.scale,
            color: item.color,
            quantity: item.quantity,
            maxStock: item.maxStock,
          }));
          setCart(mapped);
        }
      } catch (e) {
        console.error("Failed to load cart from database", e);
      } finally {
        setIsInitialized(true);
      }
    }
    loadCart();
  }, []);

  const addToCart = async (item: Omit<CartItem, "quantity">, quantity = 1) => {
    // 1. Optimistic client update
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { ...item, quantity }];
      }
    });
    setIsCartOpen(true);

    // 2. Server sync
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          scale: item.scale,
          color: item.color,
          quantity,
          maxStock: (item as any).maxStock,
        }),
      });
    } catch (e) {
      console.error("Failed to sync add-to-cart with database", e);
    }
  };

  const removeFromCart = async (id: string) => {
    // 1. Optimistic client update
    setCart((prev) => prev.filter((item) => item.id !== id));

    // 2. Server sync
    try {
      const params = new URLSearchParams();
      params.set("productId", id);
      await fetch(`/api/cart?${params.toString()}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.error("Failed to sync remove-from-cart with database", e);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    // 1. Optimistic client update
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

    // 2. Server sync
    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          quantity,
        }),
      });
    } catch (e) {
      console.error("Failed to sync update-quantity with database", e);
    }
  };

  const clearCart = async () => {
    // 1. Optimistic client update
    setCart([]);

    // 2. Server sync
    try {
      await fetch("/api/cart", {
        method: "DELETE",
      });
    } catch (e) {
      console.error("Failed to sync clear-cart with database", e);
    }
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
