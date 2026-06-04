"use client";
import { Shield, Users, Layers, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 min-h-screen">
      <div className="mb-8">
        <span className="text-xs text-red-400 font-mono tracking-widest uppercase flex items-center gap-1">
          <Shield size={12} /> Root Administrative Perimeter
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white text-glow-gold mt-1">High Council Command</h1>
      </div>

      {/* CORE COUNTER MATRIX */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-xs font-mono">
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-gray-500 block">Total Registered Souls</span>
          <span className="text-lg font-bold text-white mt-1 block">1,402 Users</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-gray-500 block">Platform Steed Nodes</span>
          <span className="text-lg font-bold text-brand-cyan mt-1 block">186 Vehicles</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5">
          <span className="text-gray-500 block">Total Active Runs</span>
          <span className="text-lg font-bold text-brand-gold mt-1 block">34 Rides Live</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-red-500/10">
          <span className="text-gray-500 block">SOS Warning Flags</span>
          <span className="text-lg font-bold text-green-400 mt-1 block">0 Alert Flags</span>
        </div>
      </div>

      {/* GLOBAL SYSTEM AUDIT MONITORING PANEL LOGS */}
      <div className="glass-panel rounded-2xl border border-white/5 p-5">
        <h3 className="text-sm font-bold text-white mb-4">Master Platform Transaction Logs</h3>
        <div className="space-y-3 font-mono text-[11px]">
          <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <span className="text-brand-cyan font-bold">[USER_REGISTRATION]</span> New owner listed asset <strong>ID: #V-9012</strong>
            </div>
            <span className="text-gray-500 text-[10px]">2 minutes ago</span>
          </div>
          <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <span className="text-brand-gold font-bold">[TOKEN_BOOKING]</span> Pilgrim account authorized settlement weight of <strong>₹2,625</strong>
            </div>
            <span className="text-gray-500 text-[10px]">14 minutes ago</span>
          </div>
          <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <span className="text-red-400 font-bold">[GEO_TRACK_SYNC]</span> Automated perimeter rules loaded for Banke Bihari perimeter ring
            </div>
            <span className="text-gray-500 text-[10px]">1 hour ago</span>
          </div>
        </div>
      </div>

    </div>
  );
}