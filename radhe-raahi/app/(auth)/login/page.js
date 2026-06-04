"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Shield, User, Car, Briefcase } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("renter"); // Default role

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate login inside Phase 1
    setUser({ 
      name: `Explorer ${role === 'admin' ? 'Chief' : role === 'owner' ? 'Lord' : 'Raahi'}`, 
      email: email 
    }, role);

    // Send them to correct cave dashboard
    if (role === "admin") router.push("/admin");
    else if (role === "owner") router.push("/owner");
    else router.push("/renter");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-white/5 relative shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xl">🛞</span>
          <h2 className="text-2xl font-bold text-white mt-2 text-glow-gold">Return to Journey</h2>
          <p className="text-xs text-gray-400 mt-1">Enter your credentials to claim your ride</p>
        </div>

        {/* Phase 1 Role Simulator Toggle Buttons */}
        <div className="mb-6 bg-black/40 p-1.5 rounded-xl border border-white/5 grid grid-cols-3 gap-1 text-center">
          <button 
            type="button"
            onClick={() => setRole("renter")}
            className={`py-2 rounded-lg text-[11px] font-mono font-bold uppercase transition-all cursor-pointer flex flex-col items-center gap-1 ${role === "renter" ? "bg-brand-cyan text-black shadow-md" : "text-gray-400 hover:text-white"}`}
          >
            <Car size={12} /> Renter
          </button>
          <button 
            type="button"
            onClick={() => setRole("owner")}
            className={`py-2 rounded-lg text-[11px] font-mono font-bold uppercase transition-all cursor-pointer flex flex-col items-center gap-1 ${role === "owner" ? "bg-brand-gold text-black shadow-md" : "text-gray-400 hover:text-white"}`}
          >
            <Briefcase size={12} /> Owner
          </button>
          <button 
            type="button"
            onClick={() => setRole("admin")}
            className={`py-2 rounded-lg text-[11px] font-mono font-bold uppercase transition-all cursor-pointer flex flex-col items-center gap-1 ${role === "admin" ? "bg-red-500 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
          >
            <Shield size={12} /> Admin
          </button>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-400 tracking-wider uppercase font-mono flex items-center gap-1">
              <Mail size={12} /> Email Address
            </label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-400 tracking-wider uppercase font-mono flex items-center gap-1">
              <Lock size={12} /> Security Key
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan"
              required
            />
          </div>

          <button 
            type="submit"
            className={`w-full mt-4 font-bold text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all duration-300 transform active:scale-95 shadow-lg border cursor-pointer ${
              role === 'admin' ? 'bg-red-600 hover:bg-red-500 text-white border-red-500' :
              role === 'owner' ? 'bg-brand-gold text-black border-brand-gold btn-glow-gold' :
              'bg-brand-cyan text-black border-brand-cyan btn-glow-cyan'
            }`}
          >
            Enter Platform as {role}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-gray-400">
          New to Vrindavan lines?{" "}
          <Link href="/register" className="text-brand-cyan hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
}