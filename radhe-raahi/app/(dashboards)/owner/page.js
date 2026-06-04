"use client";
import { useState } from "react";
import { PlusCircle, List, DollarSign, Settings } from "lucide-react";

export default function OwnerDashboard() {
  const [vehicles, setVehicles] = useState([
    { id: 1, name: "Yamuna Highway Cruiser 350", type: "Bike", price: "900", status: "Active" },
    { id: 2, name: "Gopal Eco Scooty Rig", type: "Scooty", price: "400", status: "Rented Out" }
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <div>
          <span className="text-xs text-brand-gold font-mono tracking-widest uppercase">Asset Management Terminal</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white text-glow-gold mt-1">Owner Command Engine</h1>
        </div>
        <button 
          onClick={() => alert("Simulating fleet registration pipeline step...")}
          className="bg-brand-gold text-black font-extrabold text-xs tracking-widest uppercase px-4 py-3 rounded-xl transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-brand-gold/10 cursor-pointer"
        >
          <PlusCircle size={14} /> Add New Steed
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-xs font-mono">
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-gray-500 block">Total Registered Fleet</span>
          <span className="text-xl font-bold text-white mt-1 block">2 Rigs Listed</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-brand-gold/10">
          <span className="text-gray-500 block">Gross Gold Coin Earnings</span>
          <span className="text-xl font-bold text-brand-gold mt-1 block">₹14,200</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-gray-500 block">Fleet Utilization Score</span>
          <span className="text-xl font-bold text-brand-cyan mt-1 block">88% Active</span>
        </div>
      </div>

      {/* VEHICLES CURRENT CONFIGURATION */}
      <div className="glass-panel rounded-2xl border border-white/5 p-5">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <List size={16} className="text-brand-cyan" /> Your Monitored Fleet Assets
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-gray-500">
                <th className="pb-3 font-semibold">Asset Identity</th>
                <th className="pb-3 font-semibold">Classification</th>
                <th className="pb-3 font-semibold">Pricing Anchor</th>
                <th className="pb-3 font-semibold text-right">Operational State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td className="py-4 text-white font-sans font-bold">{v.name}</td>
                  <td className="py-4 text-gray-400 uppercase">{v.type}</td>
                  <td className="py-4 text-brand-gold font-bold">₹{v.price} / Day</td>
                  <td className="py-4 text-right">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase ${v.status === 'Active' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan'}`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}