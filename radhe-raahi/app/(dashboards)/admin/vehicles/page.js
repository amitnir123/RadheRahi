"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminVehicles() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <Link href="/admin" className="text-xs text-brand-gold font-mono flex items-center gap-1 mb-6 hover:underline">
        <ArrowLeft size={12} /> Back
      </Link>
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <h2 className="text-base font-bold text-white mb-4">Global Vehicle Grid Monitor</h2>
        <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs font-mono">
          <span className="text-white">Node #V-9012 (Eco Scooty)</span>
          <button className="bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-1 rounded text-[10px]" onClick={() => alert("Asset Node Locked")}>
            FORCE LOCK RIDE
          </button>
        </div>
      </div>
    </div>
  );
}