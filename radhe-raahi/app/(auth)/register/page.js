"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, CheckSquare } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("renter");

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Auto logging in user via proxy simulation
    setUser({ name: name, email: email }, role);
    
    if (role === "owner") router.push("/owner/dashboard");
    else router.push("/renter/dashboard");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-white/5 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-xl">✨</span>
          <h2 className="text-2xl font-bold text-white mt-1 text-glow-cyan">Join Radhe Raahi</h2>
          <p className="text-xs text-gray-400 mt-1">Setup secure portal identity keys</p>
        </div>

        {/* Selection Role Type */}
        <div className="flex gap-4 justify-center mb-6 text-xs">
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <input 
              type="radio" 
              name="reg-role" 
              checked={role === "renter"} 
              onChange={() => setRole("renter")}
              className="accent-brand-cyan"
            />
            <span>I want to Rent Vehicle</span>
          </label>
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <input 
              type="radio" 
              name="reg-role" 
              checked={role === "owner"} 
              onChange={() => setRole("owner")}
              className="accent-brand-gold"
            />
            <span>I want to List My Vehicle</span>
          </label>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-400 tracking-wider uppercase font-mono flex items-center gap-1">
              <User size={12} /> Full Full Name
            </label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gopal Das"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-400 tracking-wider uppercase font-mono flex items-center gap-1">
              <Mail size={12} /> Email Address
            </label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gopal@dham.com"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-cyan"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-400 tracking-wider uppercase font-mono flex items-center gap-1">
              <Lock size={12} /> Create Password
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

          {/* Verification terms placeholder */}
          <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/5 text-[11px] text-gray-400 leading-normal mt-1">
            <CheckSquare size={16} className="text-brand-cyan shrink-0 mt-0.5" />
            <span>I pledge that all driver logs, identification cards, and permit uploads are authentic.</span>
          </div>

          <button 
            type="submit"
            className="w-full mt-3 bg-gradient-to-r from-brand-cyan to-blue-500 text-black font-extrabold text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all duration-300 shadow-lg btn-glow-cyan cursor-pointer"
          >
            Establish Account
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-gray-400">
          Already verified pilgrim?{" "}
          <Link href="/login" className="text-brand-gold hover:underline">
            Login Here
          </Link>
        </div>

      </div>
    </div>
  );
}