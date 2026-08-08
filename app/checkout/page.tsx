"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShieldCheck, Truck, ArrowLeft, CheckCircle, CreditCard, Lock } from "lucide-react";

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.email || !formData.address) {
      alert("Please fill in all required shipping fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          image: item.image,
          scale: item.scale,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: subtotal,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setCompletedOrder(data.order);
        clearCart();
      } else {
        alert(data.message || "Failed to process order");
      }
    } catch (err) {
      console.error(err);
      alert("Order submission error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div>
          <span className="text-xs font-black uppercase text-[#0256B3] tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Order Confirmed
          </span>
          <h1 className="text-2xl font-black uppercase text-slate-900 mt-2">
            Thank you for your order!
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Order Reference: <span className="font-extrabold text-slate-900">{completedOrder.orderNumber}</span>
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-2">
          <p><strong className="text-slate-900">Name:</strong> {completedOrder.customerName}</p>
          <p><strong className="text-slate-900">Email:</strong> {completedOrder.email}</p>
          <p><strong className="text-slate-900">Shipping Address:</strong> {completedOrder.address}, {completedOrder.city} {completedOrder.zipCode}</p>
          <p><strong className="text-slate-900">Total Charged:</strong> <span className="text-[#0256B3] font-bold">${completedOrder.totalAmount?.toFixed(2) || subtotal.toFixed(2)}</span></p>
        </div>

        <Link
          href="/"
          className="inline-block w-full bg-[#0256B3] text-white font-extrabold text-xs py-3.5 px-6 rounded-xl shadow hover:bg-blue-700 uppercase tracking-wider transition-all"
        >
          Return to Garage & Shop More
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200 max-w-md mx-auto my-12 p-8">
        <h2 className="text-lg font-extrabold uppercase text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mt-1">Add items to your cart before proceeding to checkout.</p>
        <Link
          href="/"
          className="mt-6 inline-block bg-[#0256B3] text-white text-xs font-extrabold px-6 py-3 rounded-xl uppercase tracking-wider"
        >
          Explore Garage Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0256B3]">
        <ArrowLeft className="w-4 h-4" /> Return to Garage Catalog
      </Link>

      <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
        Checkout & Shipping Information
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Shipping Details Form (7 cols) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-5 h-5 text-[#0256B3]" />
            <h2 className="text-sm font-black uppercase text-slate-900">1. Shipping Address</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
              <input
                type="text"
                name="customerName"
                required
                placeholder="e.g. Paul Walker"
                value={formData.customerName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0256B3] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="paul@diecast.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0256B3] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 019-2834"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0256B3] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Street Address *</label>
              <input
                type="text"
                name="address"
                required
                placeholder="123 Speed Street, Suite 404"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0256B3] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="Los Angeles"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0256B3] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Postal / Zip Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  placeholder="90001"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0256B3] focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 pt-4">
            <CreditCard className="w-5 h-5 text-[#0256B3]" />
            <h2 className="text-sm font-black uppercase text-slate-900">2. Payment Method</h2>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0256B3]" />
              <span className="font-extrabold">Simulated Secure Payment on Delivery / Demo</span>
            </div>
            <span className="font-extrabold text-[10px] bg-white px-2 py-0.5 rounded border border-blue-200">
              FREE TEST ORDER
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0256B3] hover:bg-blue-700 disabled:opacity-50 text-white font-black text-xs py-4 px-6 rounded-xl shadow-lg uppercase tracking-wider transition-all"
          >
            {isSubmitting ? "Placing Order..." : `Complete Order ($${subtotal.toFixed(2)})`}
          </button>
        </form>

        {/* Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-black uppercase text-slate-900 border-b border-slate-100 pb-3">
            Order Summary ({cart.length} items)
          </h2>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-xs">
                <div className="relative w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-slate-900 uppercase truncate">{item.name}</h4>
                  <p className="text-slate-500 text-[11px]">Qty: {item.quantity} • {item.scale}</p>
                </div>
                <span className="font-extrabold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-emerald-600">FREE EXPRESS</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
              <span>Total Amount</span>
              <span className="text-[#0256B3]">${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
