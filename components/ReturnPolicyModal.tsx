"use client";

import React from "react";
import { X } from "lucide-react";

interface ReturnPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReturnPolicyModal({ isOpen, onClose }: ReturnPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">
            Return & Refund Policy
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
            <h3 className="text-white font-semibold mb-2">Returns</h3>
            <p className="text-sm leading-relaxed mb-2">
              Customers may request a return <strong className="text-white">within 5 days from the date of delivery</strong> of the order.
            </p>
            <p className="text-sm leading-relaxed mb-2">
              Return requests submitted after the 5-day return period may not be accepted.
            </p>
            <p className="text-sm leading-relaxed">
              Return eligibility may vary depending on the product category, product condition, and applicable product-specific policy.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">Damaged Product or Package</h3>
            <p className="text-sm leading-relaxed mb-3">
              If you receive a damaged product or a package that appears damaged, opened, crushed, torn, or tampered with, please contact our customer support team as soon as possible and within the 5-day return period.
            </p>
            <p className="text-sm leading-relaxed mb-2">For damage-related claims, we strongly recommend providing:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2 text-slate-300">
              <li>Clear photos of the package before opening</li>
              <li>A continuous unboxing video</li>
              <li>Photos or videos showing the damage to the product</li>
              <li>The original packaging and shipping label</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              The unboxing video may be required to verify the condition of the package and product at the time of delivery.
            </p>
          </section>

          <section className="bg-[#C8102E]/10 border border-[#C8102E]/20 p-4 rounded-lg">
            <h3 className="text-[#C8102E] font-bold mb-2">Unboxing Video Verification</h3>
            <p className="text-sm leading-relaxed mb-2 text-slate-300">Customers are advised to record the complete unboxing process.</p>
            <p className="text-sm leading-relaxed mb-2 text-slate-300">The video should clearly show:</p>
            <ol className="list-decimal list-inside text-sm space-y-2 ml-2 text-slate-300">
              <li>The sealed package before opening.</li>
              <li>The shipping label and package condition.</li>
              <li>The complete opening of the package.</li>
              <li>The internal packaging and protective materials.</li>
              <li>The product and any visible damage.</li>
              <li>All accessories and items received with the order.</li>
            </ol>
            <p className="text-sm leading-relaxed mt-3 text-slate-300">
              For certain products or damage claims, an unboxing video may be required before a return, replacement, or refund can be approved.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">Return Conditions</h3>
            <p className="text-sm leading-relaxed mb-2">To qualify for a return, the product must generally:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2 text-slate-300">
              <li>Be returned within <strong className="text-white">5 days from the date of delivery</strong>.</li>
              <li>Be unused or in the condition specified for the product.</li>
              <li>Include the original packaging, accessories, manuals, tags, and other included items, where applicable.</li>
              <li>Not show damage caused by misuse, improper handling, or unauthorized modification.</li>
              <li>Meet the applicable product-specific return conditions.</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              Products specifically marked as "Non-Returnable" cannot be returned except where required by applicable law or in cases of verified defects or damage covered by this policy.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">Return Verification</h3>
            <p className="text-sm leading-relaxed mb-2">Once the returned product is received, it may be inspected to verify:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2 text-slate-300">
              <li>Product condition</li>
              <li>Reported damage or defect</li>
              <li>Accessories and original contents</li>
              <li>Packaging</li>
              <li>Serial number or identifying information, where applicable</li>
              <li>Whether the returned item matches the original order</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">The final resolution will be determined after verification.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">Refunds</h3>
            <p className="text-sm leading-relaxed mb-2">
              If a refund is approved, the refund amount and method will depend on the circumstances of the return and the condition of the product.
            </p>
            <p className="text-sm leading-relaxed mb-2">Depending on the case, the resolution may include:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2 text-slate-300">
              <li>Full refund</li>
              <li>Partial refund</li>
              <li>Product replacement</li>
              <li>Store credit</li>
              <li>Another appropriate resolution</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              Refunds will generally be processed after the returned product has been received and successfully verified.
            </p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">Return Rejection</h3>
            <p className="text-sm leading-relaxed mb-2">A return request may be rejected if:</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2 text-slate-300">
              <li>The request is submitted after <strong className="text-white">5 days from the date of delivery</strong>.</li>
              <li>The product has been used, damaged, modified, or mishandled by the customer.</li>
              <li>Required accessories or original components are missing.</li>
              <li>The returned product does not match the product originally shipped.</li>
              <li>The product shows signs of misuse or intentional damage.</li>
              <li>The product does not meet the applicable product-specific return conditions.</li>
              <li>Required evidence for a damage-related claim is not provided, where applicable.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">How to Request a Return</h3>
            <p className="text-sm leading-relaxed mb-2">
              To request a return, contact our 24/7 customer support team <strong className="text-white">within 5 days from the date of delivery</strong> and provide:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-2 text-slate-300">
              <li>Order ID</li>
              <li>Product details</li>
              <li>Reason for the return</li>
              <li>Photos or videos, where applicable</li>
              <li>Unboxing video for damage-related claims, where required</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">Our support team will review the request and provide the next steps.</p>
          </section>

          <section className="bg-white/5 border border-white/10 p-4 rounded-lg mt-4">
            <h3 className="text-white font-semibold mb-2">Important</h3>
            <p className="text-sm leading-relaxed mb-2">
              The <strong className="text-white">5-day return period begins from the date the order is marked as delivered</strong>.
            </p>
            <p className="text-sm leading-relaxed mb-2">
              Return, replacement, and refund decisions are subject to product eligibility, product condition, verification, and the applicable terms for the product.
            </p>
            <p className="text-sm leading-relaxed">
              We reserve the right to verify every return request before approving a replacement or refund.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
