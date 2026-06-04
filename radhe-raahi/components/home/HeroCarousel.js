"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookingWidget from "./BookingWidget";

const SLIDES = [
  {
    title: "BRAD BHRAMAN, AB HUA AASAAN.",
    subtitle: "Book Your Ride in Vrindavan",
    tagline: "Explore ancient holy paths with modern premium comfort.",
    btnText: "Book Ride",
    link: "/fleet",
    bgGradient: "from-amber-950/40 to-slate-950/90",
    iconSymbol: "🛕"
  },
  {
    title: "RIDE FREELY. EXPLORE MORE.",
    subtitle: "GPS enabled rentals",
    tagline: "Satellite trackers keeping you secure under holy horizons.",
    btnText: "Explore Fleet",
    link: "/fleet",
    bgGradient: "from-cyan-950/40 to-slate-950/90",
    iconSymbol: "🛰️"
  },
  {
    title: "FAMILY TRIP? WE HANDLE RIDE.",
    subtitle: "Cars for comfortable travel",
    tagline: "Spacious multi-seat luxury cruisers for temple group voyages.",
    btnText: "View Cars",
    link: "/fleet",
    bgGradient: "from-blue-950/40 to-slate-950/90",
    iconSymbol: "🚗"
  },
  {
    title: "VEHICLE SLEEP? MAKE MONEY.",
    subtitle: "List unused vehicle",
    tagline: "Earn regular gold coins while sharing transport with fellow pilgrims.",
    btnText: "Become Owner",
    link: "/register",
    bgGradient: "from-yellow-950/30 to-slate-950/90",
    iconSymbol: "🪙"
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000); // 6 Sec Auto Shift
    return () => clearInterval(interval);
  }, [current]);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative min-h-[700px] md:min-h-[600px] rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-[#0f141c]">
      
      {/* BACKGROUND IMAGE AND PARALLAX CAROUSEL FADES */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-gradient-to-br ${SLIDES[current].bgGradient} flex flex-col justify-center`}
        >
          {/* Decorative Subtle Temple Texture Backdrop Element */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* CINEMATIC HERO SLIDE CONTENT FRAME */}
          <div className="w-full max-w-4xl pl-6 pr-6 md:pl-16 flex flex-col gap-4 relative z-10 pb-44 md:pb-0">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/10 w-fit text-xs text-brand-gold font-mono tracking-widest"
            >
              <span>{SLIDES[current].iconSymbol}</span> {SLIDES[current].subtitle}
            </motion.div>

            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg text-glow-gold"
            >
              {SLIDES[current].title}
            </motion.h1>

            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs md:text-sm text-gray-400 max-w-md leading-relaxed"
            >
              {SLIDES[current].tagline}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* FLOATING CONTROL ARROWS */}
      <div className="absolute left-4 bottom-6 md:bottom-1/2 md:translate-y-1/2 flex items-center gap-2 z-30">
        <button onClick={handlePrev} className="p-2 rounded-xl bg-black/60 border border-white/10 hover:border-brand-cyan text-gray-400 hover:text-white transition-all cursor-pointer">
          <ChevronLeft size={18} />
        </button>
        <button onClick={handleNext} className="p-2 rounded-xl bg-black/60 border border-white/10 hover:border-brand-cyan text-gray-400 hover:text-white transition-all cursor-pointer">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* INDEX DOT INDICATORS */}
      <div className="absolute left-24 bottom-9 flex items-center gap-1.5 z-30">
        {SLIDES.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 transition-all rounded-full ${idx === current ? "w-6 bg-brand-cyan" : "w-1.5 bg-white/20"}`}
          />
        ))}
      </div>

      {/* THE INTEGRATED BOOKING WIDGET ATTACHED TO LOWER RIGHT REGION */}
      <div className="absolute bottom-4 right-4 left-4 md:left-auto md:bottom-8 md:right-8 z-30">
        <BookingWidget />
      </div>

    </div>
  );
}