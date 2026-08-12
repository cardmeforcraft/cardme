"use client";

import React, { useState } from "react";
import ShippingPolicyModal from "./ShippingPolicyModal";
import ReturnPolicyModal from "./ReturnPolicyModal";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Mail,
  MapPin,
  Clock3,
  Phone,
  Instagram,
} from "lucide-react";

export default function Footer() {
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  return (
    <footer className="bg-[#080808] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        


        {/* ================= MAIN FOOTER ================= */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>
       <span
  className="text-4xl font-black tracking-tight uppercase inline-block"
  style={{
    fontFamily: "'Space Grotesk', sans-serif",
    fontStyle: "italic",
  }}
>
  <span className="text-white">CARd </span>
  <span className="text-[#C8102E]">ME</span>
</span>

            <p className="text-xs text-slate-500 uppercase tracking-[0.18em] mt-2">
              Diecast Elite
            </p>

            <p className="text-sm text-slate-400 leading-relaxed mt-5 max-w-xs">
              Built for collectors. Driven by passion. Discover premium
              diecast models made for those who live for speed.
            </p>

            {/* Instagram */}
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-slate-300 hover:text-[#C8102E] transition-colors"
            >
             
              
            </a>
          </div>


          {/* STORE INFORMATION */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-5">
              Visit Us
            </h3>

            <div className="space-y-5">

              {/* Location */}
           <a
  href="https://www.google.com/maps/search/?api=1&query=11.08771390476552,76.12089494833334"
  target="_blank"
  rel="noopener noreferrer"
  className="flex gap-3 group"
>
  <MapPin className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />

  <div>
    <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
      Location
    </p>

    <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
      Anakkayam,
      <br />
      Malappuram, Kerala
    </p>

    <p className="text-xs text-[#C8102E] mt-2 font-semibold">
      
    </p>
  </div>
</a>

              {/* Opening Hours */}
              <div className="flex gap-3">
                <Clock3 className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" />

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                    Shop Times
                  </p>

                  <p className="text-sm text-slate-300">
                    9:00 AM – 9:00 PM
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Monday – Sunday
                  </p>

                 
                </div>
              </div>

            </div>
          </div>


          {/* QUICK LINKS */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-5">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">
              <Link
                href="/catalog"
                className="text-sm text-slate-400 hover:text-[#C8102E] transition-colors"
              >
               Catalog
              </Link>
  <Link
                href="#contact"
                className="text-sm text-slate-400 hover:text-[#C8102E] transition-colors"
              >
                Contact Us
              </Link>
              
            
              <button
                onClick={(e) => { e.preventDefault(); setIsShippingOpen(true); }}
                className="text-sm text-slate-400 hover:text-[#C8102E] transition-colors text-left"
              >
                Shipping Policy
              </button>

              <button
                onClick={(e) => { e.preventDefault(); setIsReturnOpen(true); }}
                className="text-sm text-slate-400 hover:text-[#C8102E] transition-colors text-left"
              >
                Returns & Refunds
              </button>

            
            </div>
          </div>


          {/* CONTACT */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-5">
              Get In Touch
            </h3>

            <div className="space-y-5">

              {/* Phone */}
              <a
                href="tel:73069422291"
                className="group flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C8102E]/10 transition-colors">
                  <Phone className="w-4 h-4 text-[#C8102E]" />
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Call Us
                  </p>

                  <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    73069422291
                  </p>
                </div>
              </a>


              {/* Email */}
              <a
                href="mailto:cardmeforcraft123@gmail.com"
                className="group flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C8102E]/10 transition-colors">
                  <Mail className="w-4 h-4 text-[#C8102E]" />
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Email Us
                  </p>

                  <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    cardmeforcraft123@gmail.com
                  </p>
                </div>
              </a>


              {/* Instagram */}
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#C8102E]/10 transition-colors">
                  <Instagram className="w-4 h-4 text-[#C8102E]" />
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Social
                  </p>

                  <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    Follow on Instagram
                  </p>
                </div>
              </a>

            </div>
          </div>

        </div>


        {/* ================= BOTTOM BAR ================= */}
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-[10px] sm:text-[11px] text-slate-600 uppercase tracking-[0.15em] text-center md:text-left">
            © 2026 CARDME · DIECAST ELITE · ALL RIGHTS RESERVED
          </p>

          <p className="text-[10px] text-slate-600 uppercase tracking-[0.15em]">
            Built for speed. Made for collectors.
          </p>

        </div>

      </div>

      <ShippingPolicyModal 
        isOpen={isShippingOpen} 
        onClose={() => setIsShippingOpen(false)} 
      />
      <ReturnPolicyModal 
        isOpen={isReturnOpen} 
        onClose={() => setIsReturnOpen(false)} 
      />
    </footer>
  );
}

