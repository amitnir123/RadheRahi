import HeroCarousel from "@/components/home/HeroCarousel";
import FleetPreview from "@/components/home/FleetPreview";
import LiveTrackingPreview from "@/components/home/LiveTrackingPreview";
import HowItWorks from "@/components/home/HowItWorks";
import ExtraSections from "@/components/home/FounderCard"; // Combined component file

export default function Home() {
  return (
    <div className="pb-16 w-full overflow-hidden">
      
      {/* 1. CINEMATIC HERO CAROUSEL WITH INTERNAL ATTACHED BOOKING BAR */}
      <div className="pt-6">
        <HeroCarousel />
      </div>

      {/* 2. FLEET PREVIEW CARDS */}
      <FleetPreview />

      {/* 3. LIVE SMART MAP PREVIEW WRAP */}
      <LiveTrackingPreview />

      {/* 4. OPERATIONAL FLOW PIPELINE */}
      <HowItWorks />

      {/* 5. FOUNDER + PROMO + REVIEWS GRID COMPONENT */}
      <ExtraSections />

    </div>
  );
}