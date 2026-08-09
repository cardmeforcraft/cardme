/* Navbar.tsx - Dynamic overflow navbar: extra categories collapse into "More" dropdown
   Receives initialLinks from NavbarWrapper (server component) — no client-side API fetch needed. */
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  ShieldCheck,
  Car,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

interface NavLinkItem {
  name: string;
  href: string;
}

const FIXED_LINKS: NavLinkItem[] = [
  { name: "HOME", href: "/" },
  { name: "CATALOG", href: "/catalog" },
  { name: "CONTACT", href: "#footer" },
];

/** Width (px) reserved for the "More ▾" button */
const MORE_BTN_W = 72;
/** Gap between nav items matching Tailwind gap-5 = 20px */
const GAP = 20;

interface NavbarProps {
  /** Full list of nav links pre-computed by NavbarWrapper (server component).
   *  Falls back to FIXED_LINKS if not provided. */
  initialLinks?: NavLinkItem[];
}

export default function Navbar({ initialLinks }: NavbarProps) {
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Use server-provided links immediately — no loading flash
  const categoryLinks = initialLinks ?? FIXED_LINKS;

  /** How many items are shown directly; the rest go into "More" */
  const [visibleCount, setVisibleCount] = useState(categoryLinks.length);

  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const moreRef = useRef<HTMLDivElement>(null);

  /** Measure which items fit and update visibleCount */
  const recalculate = useCallback(() => {
    if (!navRef.current) return;
    const available = navRef.current.offsetWidth;
    const widths = itemRefs.current.slice(0, categoryLinks.length).map((el) => (el ? el.offsetWidth : 80));

    let used = 0;
    let count = 0;
    for (let i = 0; i < widths.length; i++) {
      const gap = i === 0 ? 0 : GAP;
      const isLast = i === widths.length - 1;
      const needed = isLast && count === i
        ? used + gap + widths[i]
        : used + gap + widths[i] + GAP + MORE_BTN_W;
      if (needed <= available) {
        used += gap + widths[i];
        count++;
      } else {
        break;
      }
    }
    setVisibleCount(count);
  }, [categoryLinks.length]);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => recalculate());
    ro.observe(el);
    recalculate();
    return () => ro.disconnect();
  }, [recalculate]);

  /** Close "More" dropdown on outside click */
  useEffect(() => {
    if (!isMoreOpen) return;
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMoreOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const moreLinks = categoryLinks.slice(visibleCount);

  return (
    <header className="w-full border-b border-slate-200/50 sticky top-0 z-40 shadow-sm glass-nav">
      {/* Top announcement banner */}
      <div className="bg-[#C8102E] text-white text-[11px] sm:text-xs font-semibold py-1.5 text-center px-4 tracking-wide flex items-center justify-center gap-1.5">
        <Car className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">Shop our latest diecast arrivals!</span>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Brand & mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-[#C8102E] rounded-lg hover:bg-slate-100 transition-colors"
            title="Toggle Menu"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span
              className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A1A2E] group-hover:text-[#C8102E] transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontStyle: "italic" }}
            >
              CARD
            </span>
          
            <span
              className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A1A2E] group-hover:text-[#C8102E] transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontStyle: "italic", color: "#C8102E" }}
            >
              ME
            </span>
          </Link>
        </div>

        {/* Desktop search */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center relative flex-1 max-w-lg mx-6"
        >
          <input
            type="text"
            placeholder="Search by car model, scale, brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2.5 text-slate-700 hover:text-[#C8102E] rounded-full hover:bg-slate-100 transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#C8102E] bg-slate-100 hover:bg-red-50 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-200 transition-all"
            title="Admin Dashboard"
          >
            <ShieldCheck className="w-4 h-4 text-[#C8102E]" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 text-slate-700 hover:text-[#C8102E] bg-slate-100 hover:bg-red-50 rounded-full transition-colors"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C8102E] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search dropdown */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 bg-white overflow-hidden"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search diecast cars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-slate-200 bg-white max-h-[80vh] overflow-y-auto shadow-2xl overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <form onSubmit={handleSearchSubmit} className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search car model or scale..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </form>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 pb-1">
                  Categories &amp; Scales
                </p>
                {categoryLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 text-xs font-bold text-slate-800 hover:text-[#C8102E] hover:bg-slate-50 rounded-lg transition-colors uppercase tracking-wider"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop overflow-aware nav ─────────────────────────────────────── */}
      <nav className="hidden md:block border-t border-slate-200 bg-transparent py-2.5 px-4">
        <div
          ref={navRef}
          className="max-w-7xl mx-auto flex items-center gap-5 text-[11px] font-bold tracking-wider text-slate-600 uppercase overflow-hidden"
        >
          {categoryLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              className={[
                "whitespace-nowrap hover:text-[#C8102E] transition-colors px-0.5 py-0.5 shrink-0",
                idx < visibleCount ? "block" : "hidden",
              ].join(" ")}
            >
              {link.name}
            </Link>
          ))}

          {/* "More ▾" dropdown — only when there are overflow items */}
          {moreLinks.length > 0 && (
            <div ref={moreRef} className="relative shrink-0">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="flex items-center gap-1 whitespace-nowrap text-slate-600 hover:text-[#C8102E] transition-colors px-0.5 py-0.5 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isMoreOpen}
              >
                More
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMoreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isMoreOpen && (
                <div className="absolute left-0 top-full mt-2 min-w-[200px] bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  {moreLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      onClick={() => setIsMoreOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-[11px] font-bold text-slate-700 hover:text-[#C8102E] hover:bg-slate-50 uppercase tracking-wider transition-colors"
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
