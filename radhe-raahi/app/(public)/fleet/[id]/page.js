"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { ArrowLeft, Shield, MapPin, Calendar, CreditCard, Sparkles } from "lucide-react";

export default function VehicleDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const user = useStore((state) => state.user);
  
  const [days, setDays] = useState(2);
  const pricePerDay = 450;
  const baseCost = pricePerDay * days;
  const taxCost = Math.round(baseCost * 0.05); // 5% holy clean air levy 
  const totalCost = baseCost + taxCost;

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please enter authorization terminal logs first! Redirecting to login box...");
      router.push("/login");
      return;
    }
    alert(`Success! Sacred token booked for ${days} days. Total payload: ₹${totalCost}. Redirecting to renter center...`);
    router.push("/renter/dashboard");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 min-h-screen">
      
      {/* Back link element */}
      <Link href="/fleet" className="inline-flex items-center gap-2 text-xs text-brand-gold uppercase tracking-wider font-mono mb-6 hover:underline">
        <ArrowLeft size={12} /> Back to Fleet Inventory
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT DOCK CONTAINER: VEHICLE SPEC DETAIL SPECS */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/5 bg-gradient-to-b from-slate-950 to-background">
            <div className="h-64 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-center text-7xl select-none">
              🛵
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white text-glow-gold mt-6">Radhe Eco Smart Explorer (ID: {unwrappedParams.id})</h1>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Premium tailored transport rig designed for simple navigation around crowded temple squares. Whisper silent electric motor propulsion ensures clean acoustic atmospheres inside heritage zones.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-gray-500 block">Propulsion Type</span>
              <span className="text-brand-cyan font-bold">100% Lithium Electric</span>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-gray-500 block">Top Velocity Cap</span>
              <span className="text-brand-gold font-bold">45 km/h (Safe-Zone Enforced)</span>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-gray-500 block">Satellite Armor</span>
              <span className="text-green-400 font-bold">Active Live GPS Grid</span>
            </div>
          </div>
        </div>

        {/* RIGHT DOCK CONTAINER: DATE AND CHECKOUT PRICE MODULE */}
        <div className="md:col-span-1">
          <div className="glass-panel rounded-3xl p-6 border border-brand-cyan/20 bg-gradient-to-b from-[#0d1622] to-background shadow-xl flex flex-col gap-4 sticky top-24">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar size={14} className="text-brand-cyan" /> Configure Schedule
            </h3>
            
            <form onSubmit={handleConfirmBooking} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 text-xs">
                <label className="text-gray-400 font-mono">Duration Allocation (Days)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="30"
                  value={days} 
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-brand-cyan"
                  required
                />
              </div>

              {/* PAYMENT SUMMARY RECEIPT BREAKDOWN */}
              <div className="border-t border-white/10 mt-3 pt-3 flex flex-col gap-2 text-xs font-mono">
                <span className="text-[10px] text-brand-gold uppercase tracking-widest font-bold">Payload Summary</span>
                <div className="flex justify-between text-gray-400">
                  <span>₹{pricePerDay} × {days} days</span>
                  <span>₹{baseCost}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Eco Trust Levy (5%)</span>
                  <span>₹{taxCost}</span>
                </div>
                <hr className="border-white/5 my-1" />
                <div className="flex justify-between text-sm text-white font-extrabold">
                  <span className="text-brand-cyan">Total Weight Amount</span>
                  <span className="text-brand-cyan">₹{totalCost}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full mt-4 bg-brand-cyan text-black font-extrabold text-xs tracking-widest uppercase py-3 rounded-xl transition-all btn-glow-cyan flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard size={14} /> Authorize Booking
              </button>
            </form>

            <div className="text-[10px] text-gray-500 text-center font-mono mt-1">
              🔒 256-bit encrypted secure token reservation pass.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}