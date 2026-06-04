"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { User, Menu, X, Shield, Car, Briefcase } from "lucide-react";

export default function Navbar() {
  const { user, userRole, setUser, logout } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  // Quick simulation helper for testing Phase 1
  const handleSimulateLogin = (role) => {
    setUser({ name: `Test ${role}`, email: `${role}@radheraahi.com` }, role);
  };

  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-3 flex items-center justify-between">
        
        {/* LOGO (Left side - Temple Wheel Concept) */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full border-2 border-brand-gold flex items-center justify-center bg-black/40 relative overflow-hidden shadow-[0_0_10px_rgba(229,184,66,0.3)]">
            <span className="text-brand-gold font-bold text-lg group-hover:rotate-45 transition-transform duration-500">🛞</span>
            <div className="absolute top-0 right-0 w-2 h-2 bg-brand-cyan rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wider text-white">RADHE RAAHI</span>
            <span className="text-[10px] text-brand-gold tracking-widest font-mono">RENTALS</span>
          </div>
        </Link>

        {/* NAVIGATION LINKS (Center side) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link href="/" className="hover:text-brand-cyan transition-colors">Home</Link>
          <Link href="/fleet" className="hover:text-brand-gold transition-colors">Our Fleet</Link>
          <Link href="/track" className="hover:text-brand-cyan transition-colors">Track Your Ride</Link>
          <Link href="/about" className="hover:text-brand-gold transition-colors">About Vrindavan</Link>
        </div>

        {/* AUTH / DASHBOARD ACTIONS (Right side) */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <div className="flex items-center gap-2">
              {/* Dev Simulation Pill Box */}
              <div className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10 flex gap-1">
                <button onClick={() => handleSimulateLogin("renter")} className="hover:text-brand-cyan">Renter</button>
                <button onClick={() => handleSimulateLogin("owner")} className="hover:text-brand-gold">Owner</button>
                <button onClick={() => handleSimulateLogin("admin")} className="hover:text-red-400">Admin</button>
              </div>
              <Link href="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/register" className="glass-panel-cyan text-brand-cyan text-sm px-5 py-2 rounded-xl font-medium btn-glow-cyan">
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Dynamic Role Badges based on active store user */}
              {userRole === "renter" && (
                <Link href="/renter/dashboard" className="text-xs text-brand-cyan bg-brand-cyan/10 px-3 py-1.5 rounded-lg border border-brand-cyan/20 flex items-center gap-1">
                  <Car size={14} /> Renter Portal
                </Link>
              )}
              {userRole === "owner" && (
                <Link href="/owner/dashboard" className="text-xs text-brand-gold bg-brand-gold/10 px-3 py-1.5 rounded-lg border border-brand-gold/20 flex items-center gap-1">
                  <Briefcase size={14} /> Owner Engine
                </Link>
              )}
              {userRole === "admin" && (
                <Link href="/admin/dashboard" className="text-xs text-red-400 bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20 flex items-center gap-1">
                  <Shield size={14} /> High Council
                </Link>
              )}
              
              <button onClick={logout} className="text-xs text-gray-400 hover:text-white underline">
                Leave
              </button>
            </div>
          )}
        </div>

        {/* MOBILE BURGER TRIGGER */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-300 hover:text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DRAWER PANEL */}
      {isOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-7xl glass-panel rounded-2xl p-6 flex flex-col gap-4 animate-fadeIn">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-gray-300">Home</Link>
          <Link href="/fleet" onClick={() => setIsOpen(false)} className="text-gray-300">Our Fleet</Link>
          <Link href="/track" onClick={() => setIsOpen(false)} className="text-gray-300">Track Your Ride</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="text-gray-300">About Vrindavan</Link>
          <hr className="border-white/10" />
          {!user ? (
            <div className="flex flex-col gap-3">
              <Link href="/login" onClick={() => setIsOpen(false)} className="text-center text-gray-300 py-2">Login</Link>
              <Link href="/register" onClick={() => setIsOpen(false)} className="glass-panel-cyan text-brand-cyan text-center py-2.5 rounded-xl">Register</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-brand-gold">Logged as {user.name}</span>
              <button onClick={() => { logout(); setIsOpen(false); }} className="text-left text-red-400 text-sm py-2">Log Out</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}