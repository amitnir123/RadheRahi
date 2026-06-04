"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function RenterProfile() {
  const user = useStore((state) => state.user);
  return (
    <div className="max-w-md mx-auto px-4 py-8 min-h-screen">
      <Link href="/renter" className="text-xs text-brand-gold font-mono flex items-center gap-1 mb-6 hover:underline">
        <ArrowLeft size={12} /> Back
      </Link>
      <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
        <div className="w-16 h-16 bg-brand-cyan/10 border border-brand-cyan text-brand-cyan text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
          {user?.name?.[0] || "R"}
        </div>
        <h2 className="text-lg font-bold text-white">{user?.name || "Verified Pilgrim"}</h2>
        <p className="text-xs text-gray-400 font-mono mt-1">{user?.email || "pilgrim@dham.com"}</p>
        <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-mono text-green-400">
          <ShieldCheck size={16} /> Government ID & License Verified
        </div>
      </div>
    </div>
  );
}