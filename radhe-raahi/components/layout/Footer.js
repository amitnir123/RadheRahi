export default function Footer() {
  return (
    <footer className="w-full mt-20 border-t border-white/5 bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Block 1: About Info */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-brand-gold text-lg">🛞</span>
            <span className="font-bold text-white tracking-wider text-sm">RADHE RAAHI</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Premium tech marketplace for spiritual voyagers. Rent verified smart vehicles equipped with GPS for safe, beautiful discovery tracks in Vrindavan Dham.
          </p>
        </div>

        {/* Block 2: Quick Steps */}
        <div>
          <h4 className="text-xs font-semibold text-brand-gold tracking-widest uppercase mb-4">Explore</h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li><a href="/fleet" className="hover:text-brand-cyan transition-colors">Electric Scooters</a></li>
            <li><a href="/fleet" className="hover:text-brand-cyan transition-colors">Cruiser Bikes</a></li>
            <li><a href="/fleet" className="hover:text-brand-cyan transition-colors">Family SUVs</a></li>
            <li><a href="/track" className="hover:text-brand-cyan transition-colors">Live Safe Map</a></li>
          </ul>
        </div>

        {/* Block 3: Regulations / Support */}
        <div>
          <h4 className="text-xs font-semibold text-brand-gold tracking-widest uppercase mb-4">Pilgrim Support</h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li><a href="/about" className="hover:text-white transition-colors">Vrindavan Guidelines</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Owner Regulations</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Safety Protocols</a></li>
            <li><a href="#" className="hover:text-white transition-colors">24/7 Helpline</a></li>
          </ul>
        </div>

        {/* Block 4: Holy Signoff */}
        <div className="flex flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/5">
          <span className="text-xs text-brand-cyan font-medium">✨ Radhe Radhe!</span>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Every ride supports eco-friendly green initiatives inside heritage perimeter zones.
          </p>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="w-full border-t border-white/5 py-4 px-6 bg-black/20 text-center text-[11px] text-gray-500">
        &copy; {new Date().getFullYear()} Radhe Raahi Rentals. Crafted for spiritual explorers. Radhe Radhe!
      </div>
    </footer>
  );
}