"use client";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export default function RenterBookings() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <Link href="/renter" className="text-xs text-brand-gold font-mono flex items-center gap-1 mb-6 hover:underline">
        <ArrowLeft size={12} /> Back to Dashboard
      </Link>
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock size={18} className="text-brand-cyan" /> Historical Ride Logs
        </h2>
        <div className="space-y-3 font-mono text-xs">
          <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex justify-between items-center">
            <div>
              <p className="text-white font-sans font-bold">Vrindavan Eco E-Scooty</p>
              <p className="text-gray-500 text-[10px] mt-1">ID: #B-4021 • May 12, 2026</p>
            </div>
            <span className="text-gray-400 bg-white/5 px-2.5 py-1 rounded border border-white/5 uppercase text-[10px]">COMPLETED</span>
          </div>
        </div>
      </div>
    </div>
  );
}