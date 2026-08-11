"use client";

import React from "react";
import { X } from "lucide-react";

interface ShippingPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShippingPolicyModal({ isOpen, onClose }: ShippingPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">
            Shipping Policy
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar text-slate-300 space-y-6">
          <section>
            <h3 className="text-white font-semibold mb-2">Delivery Across India</h3>
            <p className="text-sm leading-relaxed">
              We provide delivery across India with an estimated delivery time of <strong className="text-white">2–5 business days</strong>, depending on the delivery location and courier service.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">Trusted Delivery Partners</h3>
            <p className="text-sm leading-relaxed mb-2">Your order may be shipped through trusted logistics partners, including:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li><strong className="text-white">India Post</strong></li>
              <li><strong className="text-white">DTDC</strong></li>
              <li>Other reliable courier platforms based on your location and product.</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">We select the most suitable courier partner to ensure safe and timely delivery.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">Packaging & Dispatch Verification</h3>
            <p className="text-sm leading-relaxed">
              Before your order is shipped, we record a <strong className="text-white">video of the product and its packaging process</strong>. This video shows the product condition, packaging, and protective covering before dispatch.
              <br /><br />
              This helps us verify that the product was properly packed and in good condition when it left our facility.
            </p>
          </section>

          <section className="bg-[#C8102E]/10 border border-[#C8102E]/20 p-4 rounded-lg">
            <h3 className="text-[#C8102E] font-bold mb-2">Important: Record Your Unboxing</h3>
            <p className="text-sm leading-relaxed mb-3 text-slate-300">
              For your protection, we strongly recommend recording a <strong className="text-white">continuous video before opening and while unboxing your package</strong>.
            </p>
            <p className="text-sm leading-relaxed mb-2 text-slate-300">If the package appears damaged, opened, torn, crushed, tampered with, or otherwise unusual:</p>
            <ol className="list-decimal list-inside text-sm space-y-2 ml-2 text-slate-300">
              <li><strong className="text-white">Take clear photos/videos of the package before opening it.</strong></li>
              <li>Start a continuous <strong className="text-white">unboxing video</strong> before opening the package.</li>
              <li>Make sure the shipping label and package condition are clearly visible.</li>
              <li>Record the complete opening process and the product inside.</li>
              <li>Keep the video safely until your order has been fully verified.</li>
            </ol>
            <p className="text-sm leading-relaxed mt-3 text-slate-300">
              The unboxing video may be required as evidence if there is a <strong className="text-white">shipping-related damage or package-tampering issue</strong>.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">Delivery Delays</h3>
            <p className="text-sm leading-relaxed mb-2">Although we aim to deliver within <strong className="text-white">2–5 business days</strong>, delivery times may vary due to:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2">
              <li>Remote or difficult-to-reach locations</li>
              <li>Weather conditions</li>
              <li>Public holidays</li>
              <li>Courier operational issues</li>
              <li>Transportation disruptions</li>
              <li>Other circumstances beyond our control</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">We will make reasonable efforts to assist you in tracking and resolving delivery-related issues.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">📞 24/7 Customer Support</h3>
            <p className="text-sm leading-relaxed">
              Our customer support team is available <strong className="text-white">24/7</strong> to assist you with delivery and shipping-related concerns.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
