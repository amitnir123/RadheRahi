"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Calendar, Car, Search, ShieldCheck } from "lucide-react";

export default function BookingWidget() {
  const router = useRouter();
  const setSearchCriteria = useStore((state) => state.setSearchCriteria);
  
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [vType, setVType] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchCriteria({ pickupDate: pickup, dropDate: drop, vehicleType: vType });
    router.push("/fleet");
  };

  return (
    <div className="w-full max-w-xl glass-panel-cyan p-5 rounded-2xl flex flex-col gap-4 shadow-2xl relative z-20">
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* FIELD 1: Pickup Date */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-brand-cyan tracking-widest uppercase font-semibold flex items-center gap-1">
            <Calendar size={10} /> Pickup Date
          </label>
          <input 
            type="date" 
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
            required
          />
        </div>

        {/* FIELD 2: Drop Date */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-brand-cyan tracking-widest uppercase font-semibold flex items-center gap-1">
            <Calendar size={10} /> Drop Date
          </label>
          <input 
            type="date" 
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
            required
          />
        </div>

        {/* FIELD 3: Vehicle Category Selection */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-[10px] text-brand-gold tracking-widest uppercase font-semibold flex items-center gap-1">
            <Car size={10} /> Choose Steed Class
          </label>
          <select 
            value={vType} 
            onChange={(e) => setVType(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-brand-gold appearance-none"
            required
          >
            <option value="" className="bg-background text-white">Select Vehicle Type</option>
            <option value="scooty" className="bg-background text-white">Premium Scooty (Temple Explorer)</option>
            <option value="bike" className="bg-background text-white">Cruiser Motorcycle (Free Ride)</option>
            <option value="car" className="bg-background text-white">Heritage Family Car (SUVs)</option>
          </select>
        </div>

        {/* ACTION SUBMIT BUTTON */}
        <button 
          type="submit" 
          className="w-full sm:col-span-2 mt-2 bg-gradient-to-r from-brand-cyan to-blue-500 text-black font-bold text-xs tracking-widest uppercase py-3 rounded-xl transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-brand-cyan/20 cursor-pointer"
        >
          <Search size={14} /> Book Ride Now
        </button>
      </form>

      {/* COMPACT STATISTICS OVERVIEW BAR */}
      <div className="border-t border-white/10 pt-3 flex justify-between text-[10px] text-gray-400 font-mono tracking-tight">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
          <span>120+ Fleet Ready</span>
        </div>
        <div>⚡ 4,500+ Rides Completed</div>
        <div className="flex items-center gap-0.5 text-brand-cyan">
          <ShieldCheck size={11} /> GPS Guarded
        </div>
      </div>
    </div>
  );
}