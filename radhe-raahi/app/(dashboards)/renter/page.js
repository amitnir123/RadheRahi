"use client";
import { useStore } from "@/lib/store";
import { Car, Calendar, MapPin, CreditCard } from "lucide-react";

export default function RenterDashboard() {
  const user = useStore((state) => state.user);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 min-h-screen">
      <div className="mb-8">
        <span className="text-xs text-brand-cyan font-mono tracking-widest uppercase">Pilgrim Control Terminal</span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white text-glow-cyan mt-1">
          Welcome Raahi, {user?.name || "Spiritual Voyager"}
        </h1>
      </div>

      {/* QUICK STATUS METRICS BOXES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-xs font-mono">
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-gray-500 block">Active Reserved Steeds</span>
          <span className="text-xl font-bold text-brand-gold mt-1 block">1 Ride</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-gray-500 block">Total Holy Kilometers</span>
          <span className="text-xl font-bold text-brand-cyan mt-1 block">42 km</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-gray-500 block">Account Status Seal</span>
          <span className="text-xl font-bold text-green-400 mt-1 block">VERIFIED PILGRIM</span>
        </div>
      </div>

      {/* RECENT BOOKING LIST LOG TABLE */}
      <div className="glass-panel rounded-2xl border border-white/5 p-5">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Calendar size={16} className="text-brand-gold" /> Your Active Booking Ledger
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-gray-500">
                <th className="pb-3 font-semibold">Vehicle</th>
                <th className="pb-3 font-semibold">Allocation Window</th>
                <th className="pb-3 font-semibold">Payload Summary</th>
                <th className="pb-3 font-semibold text-right">Status Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-4 text-white font-sans font-bold flex items-center gap-2">
                  <span>🛵</span> Radhe Eco Electric E-Scooty
                </td>
                <td className="py-4 text-gray-300">June 5 – June 7 (2 Days)</td>
                <td className="py-4 text-brand-gold font-bold">₹945 paid</td>
                <td className="py-4 text-right">
                  <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                    CONFIRMED
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}