"use client";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";

export default function OwnerVehicles() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Link href="/owner" className="text-xs text-brand-gold font-mono flex items-center gap-1 hover:underline">
          <ArrowLeft size={12} /> Back
        </Link>
        <Link href="/owner/add-vehicle" className="text-xs bg-brand-cyan text-black font-bold px-3 py-1.5 rounded-lg font-mono">
          + Add Steed
        </Link>
      </div>
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <h2 className="text-base font-bold text-white mb-4">Your Tracked Assets</h2>
        <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex justify-between items-center text-xs font-mono">
          <div>
            <p className="text-white font-sans font-bold">Yamuna Highway Cruiser 350</p>
            <p className="text-brand-gold font-bold mt-1">₹900/day</p>
          </div>
          <span className="text-green-400 border border-green-500/20 bg-green-500/5 px-2 py-0.5 rounded text-[10px]">ONLINE</span>
        </div>
      </div>
    </div>
  );
}