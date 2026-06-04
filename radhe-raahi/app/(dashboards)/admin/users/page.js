"use client";
import Link from "next/link";
import { ArrowLeft, UserCheck } from "lucide-react";

export default function AdminUsers() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <Link href="/admin" className="text-xs text-brand-gold font-mono flex items-center gap-1 mb-6 hover:underline">
        <ArrowLeft size={12} /> Back
      </Link>
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <UserCheck size={16} className="text-brand-cyan" /> Registered Soul Database
        </h2>
        <div className="divide-y divide-white/5 text-xs font-mono">
          <div className="py-3 flex justify-between">
            <span className="text-white font-sans">Amit Kumar (Owner)</span>
            <span className="text-green-400">STATUS: ACTIVE</span>
          </div>
          <div className="py-3 flex justify-between">
            <span className="text-white font-sans">Gopal Das (Renter)</span>
            <span className="text-green-400">STATUS: ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}