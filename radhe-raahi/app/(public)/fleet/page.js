"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { MapPin, SlidersHorizontal, ShieldCheck, HelpCircle } from "lucide-react";

const FULL_FLEET_DATA = [
  { id: "s1", name: "Radhe Eco Electric E-Scooty", type: "scooty", price: "400", range: "85 km", fuel: "Electric", available: true },
  { id: "s2", name: "Govardhan Premium Heavy Scooty", type: "scooty", price: "550", range: "110 km", fuel: "Electric", available: true },
  { id: "b1", name: "Yamuna Highway Cruiser 350", type: "bike", price: "900", range: "Unlimited", fuel: "Petrol", available: true },
  { id: "b2", name: "Vrindavan Classic Heritage Bike", type: "bike", price: "800", range: "Unlimited", fuel: "Petrol", available: false },
  { id: "c1", name: "Dham Spiritual SUV Cruiser", type: "car", price: "2500", range: "Unlimited", fuel: "Diesel", available: true },
  { id: "c2", name: "Radhe Family Eco Wagon", type: "car", price: "1800", range: "Unlimited", fuel: "Petrol", available: true }
];

export default function FleetPage() {
  const searchCriteria = useStore((state) => state.searchCriteria);
  const [selectedType, setSelectedType] = useState(searchCriteria.vehicleType || "all");

  const filteredFleet = FULL_FLEET_DATA.filter(item => 
    selectedType === "all" ? true : item.type === selectedType
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 min-h-screen">
      
      {/* Banner Intro Head */}
      <div className="mb-10 text-left">
        <span className="text-xs text-brand-cyan tracking-widest font-mono uppercase">Vrindavan Marketplace</span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white text-glow-gold mt-1">Browse Available Fleet</h1>
        <p className="text-xs text-gray-400 mt-1">Every vehicle is verified and synced to satellite safety grids.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT DOCK: FILTER RIGS */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/10 pb-2">
              <SlidersHorizontal size={14} className="text-brand-gold" /> Filter Steeds
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Category Type</span>
              {["all", "scooty", "bike", "car"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedType(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono uppercase transition-all cursor-pointer ${selectedType === cat ? "bg-brand-cyan/20 border border-brand-cyan text-brand-cyan" : "bg-black/30 text-gray-400 border border-transparent hover:text-white"}`}
                >
                  {cat === "all" ? "✨ Show All Fleet" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT DOCK: FLEET CARDS GRID */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFleet.map((vehicle) => (
            <div key={vehicle.id} className="glass-panel rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-between">
              
              {/* Card visual frame placeholder */}
              <div className="h-40 bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center relative border-b border-white/5">
                <span className="text-5xl select-none">{vehicle.type === "scooty" ? "🛵" : vehicle.type === "bike" ? "🏍️" : "🚗"}</span>
                <span className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-md font-mono ${vehicle.available ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                  {vehicle.available ? "READY TO RIDE" : "BOOKED OUT"}
                </span>
              </div>

              {/* Card specifications detail frame */}
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <h3 className="text-base font-bold text-white leading-snug">{vehicle.name}</h3>
                  <div className="flex gap-4 text-[11px] text-gray-400 font-mono mt-2">
                    <span>⛽ {vehicle.fuel}</span>
                    <span>🔋 Range: {vehicle.range}</span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-brand-gold">₹{vehicle.price}</span>
                    <span className="text-[10px] text-gray-500 font-mono"> / day</span>
                  </div>
                  
                  <Link 
                    href={`/fleet/${vehicle.id}`}
                    className={`text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${vehicle.available ? "bg-brand-cyan text-black border-brand-cyan btn-glow-cyan" : "bg-white/5 text-gray-500 border-white/5 pointer-events-none"}`}
                  >
                    Configure
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}