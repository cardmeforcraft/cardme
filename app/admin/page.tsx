"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus, Trash2, Edit3, ShieldCheck, RefreshCw, Car, ShoppingBag,
  CheckCircle, Search, Sparkles, Upload, Tags, Layers, Phone,
} from "lucide-react";

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "add" | "config">("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  // Edit Mode
  const [editingId, setEditingId] = useState<string | null>(null);

  // Product Form State
  const [formData, setFormData] = useState({
    name: "",
    brand: "Diecast Elite",
    scale: "1:64 (Standard)",
    series: "Street / Track",
    price: "",
    originalPrice: "",
    color: "Silver",
    badge: "NEW ARRIVAL",
    image: "",
    description: "",
    features: "1:32 Scale Diecast Model, 2 Doors Openable, Metal Alloy Body",
    stockCount: "25",
  });

  // Config State (scales & categories)
  const [scales, setScales] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newScale, setNewScale] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [configSaving, setConfigSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // WhatsApp number config
  const [whatsappNumber, setWhatsappNumber] = useState(""); // stored with 91 prefix
  const [whatsappInput, setWhatsappInput] = useState("");   // 10-digit user input
  const [whatsappSaving, setWhatsappSaving] = useState(false);
  const [whatsappError, setWhatsappError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, cfgRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
        fetch("/api/config"),
      ]);
      const prodData = await prodRes.json();
      const orderData = await orderRes.json();
      const cfgData = await cfgRes.json();

      if (prodData.success) setProducts(prodData.products || []);
      if (orderData.success) setOrders(orderData.orders || []);
      if (cfgData.success) {
        setScales(cfgData.scales || []);
        setCategories(cfgData.categories || []);
        const stored = cfgData.whatsappNumber || "917907343387";
        setWhatsappNumber(stored);
        // Display only the last 10 digits (strip country code 91)
        setWhatsappInput(stored.startsWith("91") ? stored.slice(2) : stored);
      }
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSeed = async () => {
    if (!confirm("Are you sure you want to re-seed the catalog with default diecast car models?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/seed");
      const data = await res.json();
      setStatusMsg(data.message || "Database seeded!");
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete '${name}' from inventory?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(`Product '${name}' removed successfully.`);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(`Order status updated to ${newStatus}.`);
        fetchData();
      } else {
        alert("Failed to update order status: " + data.message);
      }
    } catch (e) {
      console.error(e);
      alert("Error updating order status");
    }
  };

  const handleEditClick = (product: any) => {
    setEditingId(product._id || product.slug);
    setFormData({
      name: product.name || "",
      brand: product.brand || "Diecast Elite",
      scale: product.scale || "1:64 (Standard)",
      series: product.series || "Street / Track",
      price: product.price ? String(product.price) : "",
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      color: product.color || "Silver",
      badge: product.badge || "NEW ARRIVAL",
      image: product.images?.[0] || "",
      description: product.description || "",
      features: Array.isArray(product.features) ? product.features.join(", ") : "",
      stockCount: product.stockCount ? String(product.stockCount) : "25",
    });
    setActiveTab("add");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      setStatusMsg("");
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataObj,
        });
        const data = await res.json();
        if (data.success) {
          setFormData((prev) => ({ ...prev, image: data.url }));
          setStatusMsg("Image uploaded successfully!");
        } else {
          alert("Upload failed: " + data.message);
        }
      } catch (error: any) {
        console.error("Error uploading image:", error);
        alert("Error uploading image: " + error.message);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Name and Price are required.");
      return;
    }
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stockCount: parseInt(formData.stockCount || "25"),
        images: [formData.image || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80"],
        features: formData.features.split(",").map((f) => f.trim()).filter(Boolean),
      };

      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(editingId ? "Product updated successfully!" : "New diecast car added to garage!");
        setEditingId(null);
        setFormData({
          name: "",
          brand: "Diecast Elite",
          scale: "1:64 (Standard)",
          series: "Street / Track",
          price: "",
          originalPrice: "",
          color: "Silver",
          badge: "NEW ARRIVAL",
          image: "",
          description: "",
          features: "1:32 Scale Diecast Model, 2 Doors Openable, Metal Alloy Body",
          stockCount: "25",
        });
        setActiveTab("products");
        fetchData();
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save product");
    }
  };

  // ── Config helpers ──────────────────────────────────────────────────────────
  const saveConfig = async (updatedScales: string[], updatedCategories: string[]) => {
    setConfigSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scales: updatedScales, categories: updatedCategories }),
      });
      const data = await res.json();
      if (data.success) {
        setScales(data.scales);
        setCategories(data.categories);
        setStatusMsg("Configuration saved! Navbar & filters updated.");
      }
    } catch (e) {
      alert("Failed to save configuration");
    } finally {
      setConfigSaving(false);
    }
  };

  const addScale = () => {
    const trimmed = newScale.trim();
    if (!trimmed || scales.includes(trimmed)) return;
    const updated = [...scales, trimmed];
    setScales(updated);
    saveConfig(updated, categories);
    setNewScale("");
  };

  const removeScale = (s: string) => {
    const updated = scales.filter((x) => x !== s);
    setScales(updated);
    saveConfig(updated, categories);
  };

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    const updated = [...categories, trimmed];
    setCategories(updated);
    saveConfig(scales, updated);
    setNewCategory("");
  };

  const removeCategory = (c: string) => {
    const updated = categories.filter((x) => x !== c);
    setCategories(updated);
    saveConfig(scales, updated);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.scale.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-16">
      

      {statusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{statusMsg}</span>
          </div>
          <button onClick={() => setStatusMsg("")} className="text-slate-400 hover:text-slate-600">×</button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-[#C8102E] rounded-xl">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Garage Inventory</p>
            <h3 className="text-2xl font-black text-slate-900">{products.length} Cars</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Customer Orders</p>
            <h3 className="text-2xl font-black text-slate-900">{orders.length} Orders</h3>
          </div>
        </div>
     
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-white p-2 rounded-xl shadow-sm gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setActiveTab("products"); setEditingId(null); }}
            className={`px-4 py-2 text-xs font-black uppercase rounded-lg transition-colors ${
              activeTab === "products" ? "bg-[#C8102E] text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 text-xs font-black uppercase rounded-lg transition-colors ${
              activeTab === "orders" ? "bg-[#C8102E] text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Customer Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("config")}
            className={`px-4 py-2 text-xs font-black uppercase rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "config" ? "bg-[#C8102E] text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Tags className="w-3.5 h-3.5" />
            Categories &amp; Scales
          </button>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: "",
              brand: "Diecast Elite",
              scale: "1:64 (Standard)",
              series: "Street / Track",
              price: "",
              originalPrice: "",
              color: "Silver",
              badge: "NEW ARRIVAL",
              image: "",
              description: "",
              features: "1:32 Scale Diecast Model, 2 Doors Openable, Metal Alloy Body",
              stockCount: "25",
            });
            setActiveTab("add");
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2 rounded-lg flex items-center gap-1.5 uppercase shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Car</span>
        </button>
      </div>

      {/* ── TAB 1: PRODUCT INVENTORY ─────────────────────────────────────────── */}
      {activeTab === "products" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search inventory by car name or scale..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <span className="text-xs text-slate-500 font-bold">
              Showing {filteredProducts.length} diecast items
            </span>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 text-[#C8102E] animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Loading catalog...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-black uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Preview</th>
                    <th className="p-3.5">Car Model</th>
                    <th className="p-3.5">Scale</th>
                    <th className="p-3.5">Series</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredProducts.map((prod) => (
                    <tr key={prod._id || prod.slug} className="hover:bg-slate-50/80">
                      <td className="p-3.5">
                        <div className="relative w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                          <Image
                            src={prod.images?.[0] || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80"}
                            alt={prod.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {prod.name}
                        {prod.badge && (
                          <span className="ml-2 text-[9px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.5 rounded">
                            {prod.badge}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-semibold text-red-700">{prod.scale}</td>
                      <td className="p-3.5">{prod.series || prod.brand}</td>
                      <td className="p-3.5 font-extrabold text-slate-900">₹{prod.price?.toFixed(2)}</td>
                      <td className="p-3.5 font-bold text-emerald-600">{prod.stockCount || 25} in stock</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(prod)}
                            className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-[#C8102E] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id, prod.name)}
                            className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: CUSTOMER ORDERS ───────────────────────────────────────────── */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <h2 className="text-sm font-black uppercase text-slate-900 border-b border-slate-100 pb-3">
            Recent Customer Orders
          </h2>
          {orders.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase">
              No customer orders recorded yet. Place an order on checkout to test live order saving!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-black uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Email / Phone</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-extrabold text-[#C8102E]">{ord.orderNumber}</td>
                      <td className="p-3 font-bold text-slate-900">{ord.customerName}</td>
                      <td className="p-3 text-slate-500">{ord.email}<br />{ord.phone}</td>
                      <td className="p-3 text-slate-600">{ord.address}, {ord.city}</td>
                      <td className="p-3 font-semibold">{ord.items?.length || 1} diecast car(s)</td>
                      <td className="p-3 font-black text-slate-900">₹{ord.totalAmount?.toFixed(2)}</td>
                      <td className="p-3">
                        <select
                          value={ord.status || "Pending"}
                          onChange={(e) => handleOrderStatusChange(ord._id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Success">Success</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: ADD / EDIT PRODUCT FORM ───────────────────────────────────── */}
      {activeTab === "add" && (
        <form onSubmit={handleSubmitForm} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base font-black uppercase text-slate-900">
              {editingId ? "Edit Diecast Car" : "Add New Diecast Car to Inventory"}
            </h2>
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Car Model Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Nissan Skyline GTR R34 Paul Walker Edition"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Scale Category *</label>
              <select
                value={formData.scale}
                onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
              >
                {scales.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Series / Collection</label>
              <select
                value={formData.series}
                onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="24.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Original Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="34.99"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Badge Tag</label>
              <select
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="NEW ARRIVAL">NEW ARRIVAL</option>
                <option value="DISCOUNT SALE">DISCOUNT SALE</option>
                <option value="INSTOCK NOW">INSTOCK NOW</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Color Variant</label>
              <input
                type="text"
                placeholder="Silver and Blue"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            {/* Image Upload */}
            <div className="sm:col-span-2 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-black uppercase text-slate-800 tracking-wider">
                Product Image (Upload File or Enter URL)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                {uploading ? (
                  <div className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-100 text-slate-500 border border-slate-300 rounded-xl text-xs font-bold">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C8102E]" />
                    <span>Uploading..</span>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer text-xs font-bold transition-all shadow-sm">
                    <Upload className="w-4 h-4 text-[#C8102E]" />
                    <span>Upload Image File from Device</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                )}
                <input
                  type="text"
                  placeholder="OR paste Image URL (https://...)"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                  disabled={uploading}
                />
              </div>
              {formData.image && (
                <div className="flex items-center gap-3 pt-2">
                  <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden border border-slate-300 shrink-0">
                    <Image src={formData.image} alt="Uploaded preview" fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Image Ready
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                      {formData.image.startsWith("data:") ? "Uploaded local image file" : formData.image}
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="text-[11px] font-bold text-red-600 hover:underline mt-1"
                    >
                      Clear Image
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Detailed vehicle description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Vehicle Specifications (Comma separated)
              </label>
              <input
                type="text"
                placeholder="1:32 Scale Diecast, 2 Doors Openable, Heavy Alloy Body, Sound Simulation"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stock Count *</label>
              <input
                type="number"
                min="0"
                required
                placeholder="25"
                value={formData.stockCount}
                onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-[#C8102E] hover:bg-red-700 text-white font-black text-xs py-3.5 px-6 rounded-xl shadow-lg uppercase tracking-wider transition-all disabled:opacity-50"
          >
            {uploading ? "Uploading Image..." : (editingId ? "Update Diecast Car" : "Save Diecast Car to Inventory")}
          </button>
        </form>
      )}

      {/* ── TAB 4: CATEGORIES, SCALES & WHATSAPP MANAGER ─────────────────────── */}
      {activeTab === "config" && (
        <div className="space-y-6">

          {/* ── WHATSAPP NUMBER PANEL ───────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2.5 bg-green-50 rounded-xl">
                <Phone className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase text-slate-900">WhatsApp Order Number</h2>
                <p className="text-[11px] text-slate-400">
                  New orders will be sent to this number via WhatsApp
                </p>
              </div>
            </div>
            <div className="p-5">
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 focus-within:ring-2 focus-within:ring-[#25D366] focus-within:border-[#25D366]">
                    <span className="px-3 py-2.5 text-xs font-black text-slate-500 bg-slate-100 border-r border-slate-200 shrink-0">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit mobile number"
                      value={whatsappInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setWhatsappInput(val);
                        setWhatsappError("");
                      }}
                      className="flex-1 px-3 py-2.5 text-sm bg-transparent focus:outline-none font-mono tracking-widest"
                    />
                    <span className={`px-3 text-xs font-bold shrink-0 ${
                      whatsappInput.length === 10 ? "text-emerald-600" : "text-slate-300"
                    }`}>
                      {whatsappInput.length}/10
                    </span>
                  </div>
                  {whatsappError && (
                    <p className="text-[11px] text-red-600 font-bold mt-1">{whatsappError}</p>
                  )}
                  {whatsappNumber && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      Current: <span className="font-black text-slate-700">+{whatsappNumber}</span>
                    </p>
                  )}
                </div>
                <button
                  disabled={whatsappSaving || whatsappInput.length !== 10}
                  onClick={async () => {
                    if (whatsappInput.length !== 10) {
                      setWhatsappError("Please enter exactly 10 digits.");
                      return;
                    }
                    setWhatsappSaving(true);
                    setWhatsappError("");
                    try {
                      const res = await fetch("/api/config", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ whatsappNumber: whatsappInput }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        setWhatsappNumber(data.whatsappNumber);
                        setStatusMsg(`WhatsApp number updated to +${data.whatsappNumber}`);
                      } else {
                        setWhatsappError(data.message || "Failed to save number");
                      }
                    } catch {
                      setWhatsappError("Network error. Try again.");
                    } finally {
                      setWhatsappSaving(false);
                    }
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#25D366] hover:bg-green-500 disabled:opacity-40 text-white text-xs font-black rounded-lg transition-colors shadow-sm whitespace-nowrap"
                >
                  {whatsappSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Save Number
                </button>
              </div>
            </div>
          </div>

          {/* ── SCALES & CATEGORIES GRID ────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ── SCALES PANEL ──────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2.5 bg-red-50 rounded-xl">
                <Layers className="w-5 h-5 text-[#C8102E]" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase text-slate-900">Scales</h2>
                <p className="text-[11px] text-slate-400">
                  These appear in the Navbar, product form &amp; filter sidebar
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Add input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 1:36 (Mid Scale)"
                  value={newScale}
                  onChange={(e) => setNewScale(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addScale())}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                />
                <button
                  onClick={addScale}
                  disabled={configSaving || !newScale.trim()}
                  className="px-4 py-2 bg-[#C8102E] text-white text-xs font-black rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {/* Scale list */}
              <div className="space-y-2">
                {scales.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No scales defined yet.</p>
                )}
                {scales.map((s) => (
                  <div
                    key={s}
                    className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 rounded-lg border border-slate-200 group"
                  >
                    <span className="text-xs font-bold text-slate-800">{s}</span>
                    <button
                      onClick={() => removeScale(s)}
                      className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove scale"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                {scales.length} scale{scales.length !== 1 ? "s" : ""} active
              </p>
            </div>
          </div>

          {/* ── CATEGORIES PANEL ──────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 rounded-xl">
                <Tags className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase text-slate-900">Categories / Series</h2>
                <p className="text-[11px] text-slate-400">
                  These appear as series options in the product form &amp; filter sidebar
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Add input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Limited Editions"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={addCategory}
                  disabled={configSaving || !newCategory.trim()}
                  className="px-4 py-2 bg-purple-600 text-white text-xs font-black rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {/* Category list */}
              <div className="space-y-2">
                {categories.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No categories defined yet.</p>
                )}
                {categories.map((c) => (
                  <div
                    key={c}
                    className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 rounded-lg border border-slate-200 group"
                  >
                    <span className="text-xs font-bold text-slate-800">{c}</span>
                    <button
                      onClick={() => removeCategory(c)}
                      className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                {categories.length} categor{categories.length !== 1 ? "ies" : "y"} active
              </p>
            </div>
          </div>

          {/* Info banner */}
          <div className="md:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 font-semibold flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <strong>Changes are saved instantly</strong> and reflected in the product form dropdowns, catalog filter sidebar, and navbar.
              To also update the navbar quick-links, add items matching your scale/category names there.
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
