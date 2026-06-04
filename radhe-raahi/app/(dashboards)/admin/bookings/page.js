"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminBookings() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <Link href="/admin" className="text-xs text-brand-gold font-mono flex items-center gap-1 mb-6 hover:underline">
        <ArrowLeft size={12} /> Back
      </Link>
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <h2 className="text-base font-bold text-white mb-4">Platform Reservation Ledger</h2>
        <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex justify-between text-xs font-mono">
          <span className="text-gray-400">Txn: #TX-88301</span>
          <span className="text-brand-gold font-bold">₹2,625 Gross</span>
        </div>
      </div>
    </div>
  );
}