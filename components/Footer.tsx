import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#1A1A2E] text-slate-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/5 rounded-lg text-[#C8102E]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase">Express Shipping</h4>
              <p className="text-xs text-slate-400">Fast worldwide delivery</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/5 rounded-lg text-[#C8102E]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase">100% Authentic</h4>
              <p className="text-xs text-slate-400">Official diecast licensing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/5 rounded-lg text-[#C8102E]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase">Easy Returns</h4>
              <p className="text-xs text-slate-400">30 days money-back guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/5 rounded-lg text-[#C8102E]">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase">24/7 Support</h4>
              <p className="text-xs text-slate-400">Dedicated collector assistance</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Logo */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-3xl font-black text-[#C8102E] tracking-tight uppercase block" style={{ fontFamily: "'Space Grotesk', sans-serif", fontStyle: "italic" }}>
              CARDME
            </span>
          
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
              © DIECAST ELITE 2026 ™ BUILT FOR SPEED.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Link href="#newsletter" className="hover:text-[#C8102E] transition-colors">
              Newsletter
            </Link>
            <Link href="#shipping" className="hover:text-[#C8102E] transition-colors">
              Shipping Policy
            </Link>
            <Link href="#returns" className="hover:text-[#C8102E] transition-colors">
              Returns
            </Link>
            <Link href="#contact" className="hover:text-[#C8102E] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-6 border-t border-white/5 text-center text-[11px] text-slate-500">
          <p>© 2026 DIECAST ELITE. ALL RIGHTS RESERVED. BUILT WITH PASSION.</p>
        </div>
      </div>
    </footer>
  );
}
