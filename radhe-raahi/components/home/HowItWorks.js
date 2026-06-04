import { CheckCircle, Search, Key, Compass } from "lucide-react";

export default function HowItWorks() {
  const STEPS = [
    { idx: "01", title: "Select & Book", desc: "Choose scooty, bike or car via our cinematic glass calendar filters.", icon: <Search size={20} className="text-brand-cyan" /> },
    { idx: "02", title: "Unlock Ride", desc: "Verify identities online instantly and gather smart keys at nearby hubs.", icon: <Key size={20} className="text-brand-gold" /> },
    { idx: "03", title: "Explore Dham", desc: "Ride freely guided by live satellite safety trackers over holy coordinates.", icon: <Compass size={20} className="text-brand-cyan" /> }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-24 text-center">
      <span className="text-xs text-brand-gold uppercase tracking-widest font-mono">Simple Operational Pipeline</span>
      <h2 className="text-2xl md:text-4xl font-bold text-white mt-1 mb-12 text-glow-gold">How Radhe Raahi Moves</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {STEPS.map((step) => (
          <div key={step.idx} className="glass-panel p-6 rounded-2xl border border-white/5 relative text-left flex flex-col gap-3">
            <div className="absolute top-4 right-6 text-3xl font-extrabold text-white/5 font-mono select-none">{step.idx}</div>
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-sm">
              {step.icon}
            </div>
            <h3 className="text-base font-bold text-white mt-2">{step.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}