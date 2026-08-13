"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { getOptimizedImageUrl } from "@/lib/image";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity cursor-pointer"
          />

          <div className="fixed inset-y-0 right-0 w-full sm:w-auto flex pl-0 sm:pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full sm:w-screen sm:max-w-md bg-white shadow-2xl flex flex-col justify-between"
            >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C8102E]" />
              <h2 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">
                Your Cart
              </h2>
              <span className="bg-[#C8102E] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-extrabold text-slate-800 uppercase">
                  Your cart is empty
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Add some diecast models from our catalog to get started!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 bg-[#C8102E] text-white text-xs font-extrabold px-6 py-2.5 rounded-lg shadow hover:bg-red-700 transition-colors uppercase tracking-wider"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex gap-3 items-center justify-between"
                >
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-lg border border-slate-200 overflow-hidden shrink-0">
                    <Image
                      src={getOptimizedImageUrl(item.image, 150)}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black uppercase text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-500">
                      Scale: {item.scale} • {item.color}
                    </p>
                    <p className="text-sm font-black text-[#C8102E] mt-1">
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-1.5">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-black text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.maxStock !== undefined && item.quantity >= item.maxStock}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-slate-900">₹{subtotal.toFixed(2)}</span>
                </div>
                {/* <div className="flex justify-between text-slate-500">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div> */}
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                  <span>Total</span>
                  <span className="text-[#C8102E]">₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-[#C8102E] hover:bg-red-700 active:scale-[0.99] text-white text-xs font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all uppercase tracking-wider"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
      )}
    </AnimatePresence>
  );
}
