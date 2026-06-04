"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function OwnerBookings() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <Link href="/owner" className="text-xs text-brand-gold font-mono flex items-center gap-1 mb-6 hover:underline">
        <ArrowLeft size={12} /> Back
      </Link>
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <h2 className="text-base font-bold text-white mb-4">Incoming Pilgrim Orders</h2>
        <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex justify-between items-center text-xs font-mono">
          <div>
            <p className="text-white font-sans font-bold">Gopal Eco Scooty Rig</p>
            <p className="text-gray-400 text-[10px] mt-0.5">Renter: Rajesh M.</p>
          </div>
          <span className="text-brand-cyan font-bold">₹800 Collected</span>
        </div>
      </div>
    </div>
  );
}