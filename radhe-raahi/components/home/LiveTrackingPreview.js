import { Map, Navigation, ShieldAlert } from "lucide-react";

export default function LiveTrackingPreview() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
      <div className="glass-panel rounded-3xl p-6 md:p-10 border border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gradient-to-br from-slate-950 via-[#121826] to-black">
        <div className="flex flex-col gap-4">
          <span className="text-xs text-brand-cyan uppercase tracking-widest font-mono">Geofenced Pilgrimage Shield</span>
          <h2 className="text-2xl md:text-4xl font-bold text-white text-glow-cyan">Live Smart Tracking Map</h2>
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
            Never get lost in holy mazes. Every scooter, bike, and cruiser reports to satellite grids instantly. Relatives track your ride from anywhere on Earth while you explore Parikrama circles safely.
          </p>
          <div className="flex flex-col gap-3 mt-2 text-xs text-gray-300">
            <div className="flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
              <Navigation size={16} className="text-brand-cyan animate-pulse" />
              <span>SOS Emergency trigger buttons active on all handle rigs</span>
            </div>
            <div className="flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
              <ShieldAlert size={16} className="text-brand-gold" />
              <span>Automatic speed caps enforced inside heritage temple plazas</span>
            </div>
          </div>
        </div>

        {/* MOCK MAP CONTAINER (Leaflet simulation area) */}
        <div className="h-64 md:h-80 w-full bg-slate-900 rounded-2xl border border-white/10 overflow-hidden relative shadow-inner group">
          <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
          {/* Animated Mock Tracker Dot */}
          <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-brand-cyan rounded-full shadow-[0_0_15px_#00f0ff] animate-ping" />
          <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-brand-cyan rounded-full" />
          {/* Temple location mock label */}
          <div className="absolute top-[40%] left-[38%] bg-black/80 px-2 py-1 rounded text-[10px] text-brand-gold border border-brand-gold/30">
            🛕 Banke Bihari Temple
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 right-4 bg-black/80 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] font-mono text-gray-400">
            GPS Signal: <span className="text-green-400 font-bold">EXCELLENT</span>
          </div>
        </div>
      </div>
    </section>
  );
}