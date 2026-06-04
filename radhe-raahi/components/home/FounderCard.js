export default function ExtraSections() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-24 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* FOUNDER BLOCK */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest block mb-2">Message From Leader</span>
          <h3 className="text-lg font-bold text-white">Amit Kumar</h3>
          <p className="text-[11px] text-brand-gold/80 tracking-tight font-mono mb-3">Founder & CEO, Radhe Raahi</p>
          <p className="text-xs text-gray-400 italic leading-relaxed">
            "Our objective is converting chaotic local transport into structured premium tranquility for every visiting soul."
          </p>
        </div>
        <div className="h-12 border-t border-white/10 pt-3 text-[11px] font-mono text-gray-500">
          📍 Signed from Vrindavan HQ
        </div>
      </div>

      {/* WEEKLY PROMO BLOCK */}
      <div className="glass-panel p-6 rounded-3xl border border-brand-gold/20 bg-gradient-to-br from-[#1b1710] to-background flex flex-col justify-between gap-6 shadow-xl">
        <div>
          <span className="bg-brand-gold/10 text-brand-gold text-[9px] px-2 py-0.5 rounded font-mono border border-brand-gold/30 uppercase tracking-wider w-fit block mb-3">Active Offer</span>
          <h3 className="text-xl font-extrabold text-white">Janmashtami Special Coupon</h3>
          <p className="text-xs text-gray-300 mt-2 leading-relaxed">
            Apply secret seal <span className="text-brand-gold font-mono font-bold font-lg bg-black/40 px-2 py-0.5 rounded border border-white/5">KANHA10</span> at booking summaries to shred 10% weight off pricing!
          </p>
        </div>
        <p className="text-[10px] text-gray-500 font-mono">Valid Tuesday 16th to Sunday 20th</p>
      </div>

      {/* PILGRIM TESTIMONIALS */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest block mb-2">Verified Explorer Reviews</span>
          <h3 className="text-sm font-bold text-white">"Flawless Divine Experience"</h3>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            "The family SUV option let us drive elderly parents to all major temples without looking for local rickshaws. Extremely polished app system!"
          </p>
        </div>
        <div className="text-[10px] text-brand-cyan font-mono flex justify-between items-center">
          <span>— Rajesh M. (Delhi)</span>
          <span>⭐⭐⭐⭐⭐</span>
        </div>
      </div>

    </section>
  );
}