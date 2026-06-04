"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";

export default function OwnerAddVehicle() {
  const router = useRouter();
  const handleAdd = (e) => {
    e.preventDefault();
    alert("Steed metrics submitted to High Council admin queue for verification!");
    router.push("/owner");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 min-h-screen">
      <Link href="/owner" className="text-xs text-brand-gold font-mono flex items-center gap-1 mb-6 hover:underline">
        <ArrowLeft size={12} /> Cancel
      </Link>
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <h2 className="text-lg font-bold text-white mb-4">List New Rental Vehicle</h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-4 text-xs font-mono">
          <div className="flex flex-col gap-1">
            <label className="text-gray-400">Vehicle Title Name</label>
            <input type="text" placeholder="e.g. Honda Activa 6G Premium" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-gold" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-400">Pricing Goal (₹ / Day)</label>
            <input type="number" placeholder="450" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-gold" required />
          </div>
          <div className="p-4 border border-dashed border-white/20 rounded-xl text-center text-gray-500 flex flex-col items-center gap-2 cursor-pointer hover:border-brand-cyan transition-all">
            <Upload size={20} className="text-gray-400" />
            <span>Upload Registration RC / Permit Scans</span>
          </div>
          <button type="submit" className="w-full mt-2 bg-brand-gold text-black font-extrabold py-3 rounded-xl uppercase tracking-widest text-[11px]">
            Deploy to Queue
          </button>
        </form>
      </div>
    </div>
  );
}