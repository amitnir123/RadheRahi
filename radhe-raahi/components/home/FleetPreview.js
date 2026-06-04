"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Shield } from "lucide-react";

const PREVIEW_FLEET = [
  { id: 1, name: "Vrindavan Eco E-Scooty", type: "Scooty", price: "400", rating: "4.9", range: "85km", glow: "hover:shadow-[0_0_20px_rgba(0,240,255,0.25)]" },
  { id: 2, name: "Yamuna Cruiser 350cc", type: "Bike", price: "900", rating: "4.8", range: "Unlimited", glow: "hover:shadow-[0_0_20px_rgba(229,184,66,0.25)]" },
  { id: 3, name: "Dham Heritage SUV", type: "Car", price: "2500", rating: "5.0", range: "Unlimited", glow: "hover:shadow-[0_0_20px_rgba(0,240,255,0.25)]" }
];

export default function FleetPreview() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs text-brand-cyan uppercase tracking-widest font-mono">Premium Fleet Selection</span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-1 text-glow-gold">Sourced For Holy Paths</h2>
        </div>
        <Link href="/fleet" className="text-xs text-brand-gold font-bold uppercase tracking-widest flex items-center gap-2 hover:underline group">
          View Complete Fleet <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PREVIEW_FLEET.map((vehicle) => (
          <motion.div 
            key={vehicle.id}
            whileHover={{ y: -8 }}
            className={`glass-panel rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 ${vehicle.glow}`}
          >
            <div className="h-44 bg-gradient-to-t from-black/80 to-slate-900 flex items-center justify-center relative">
              <span className="text-5xl opacity-40">{vehicle.type === "Scooty" ? "🛵" : vehicle.type === "Bike" ? "🏍️" : "🚗"}</span>
              <div className="absolute top-3 left-3 bg-black/60 border border-white/10 text-[10px] text-brand-cyan px-2 py-0.5 rounded-full font-mono uppercase">
                {vehicle.type}
              </div>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <h3 className="text-base font-bold text-white">{vehicle.name}</h3>
              <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1"><MapPin size={12} className="text-brand-cyan" /> GPS Live</span>
                <span>🔋 {vehicle.range}</span>
              </div>
              <hr className="border-white/5" />
              <div className="flex justify-between items-center pt-1">
                <div>
                  <span className="text-xl font-extrabold text-brand-gold">₹{vehicle.price}</span>
                  <span className="text-[10px] text-gray-500 font-mono"> / Day</span>
                </div>
                <Link href={`/fleet/${vehicle.id}`} className="bg-white/5 border border-white/10 hover:border-brand-cyan px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all">
                  Inspect Ride
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}