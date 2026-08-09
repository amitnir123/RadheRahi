import Link from "next/link";
import {
    Car, Bike, Zap, ShieldCheck, Heart, MapPin, Users, Star,
    ChevronRight,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { STATS, SITE_TAGLINE } from "@/lib/constants";

export const metadata = {
    title: "About Us | RentRide — Vehicle Rental in Mathura & Vrindavan",
    description: "Learn about RentRide, the trusted vehicle rental brand serving pilgrims and travellers across Mathura, Vrindavan and the Braj region.",
};

const TYPE_ICON = { car: Car, bike: Bike, scooter: Zap };

export default function AboutPage() {
    return (
        <div className="container-page pb-10">

            <div className="mb-12 py-10 text-center">
                <span className="section-label">About Us</span>

                <h2 className="section-title text-3xl md:text-4xl lg:text-5xl mt-3">
                    Serving pilgrims across the Braj region
                </h2>
                <h3 className="section-desc text-base md:text-lg mt-2">
                    RentRide began in Mathura — the land of Lord Krishna — with a simple mission: give every pilgrim and traveller a safe, transparent and dependable way to explore this holy land.
                </h3>
            </div>

            {/* Story */}
            <section className="py-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Our story</h2>
                        <div className="space-y-5 text-text-secondary leading-relaxed">
                            <p>
                                Every year, millions of devotees visit Mathura, Vrindavan, Govardhan
                                and the surrounding villages of Braj. Reaching each temple and dham on
                                time can be difficult — shared transport is crowded and unreliable.
                            </p>
                            <p>
                                We built RentRide to change that. Our fleet of verified cars, bikes and
                                scooters lets you move freely between darshan spots, at your own pace,
                                with transparent pricing and no surprises.
                            </p>
                            <p>
                                Most importantly, every booking is personally confirmed by our local
                                Mathura team before you pay a single rupee. Your yatra deserves that
                                kind of care.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            {[
                                { icon: ShieldCheck, label: "Verified fleet" },
                                { icon: Users, label: "Local Mathura team" },
                                { icon: Heart, label: "Pilgrim-first service" },
                                { icon: Star, label: "4.8★ rated" },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="card card-hover flex items-center gap-3 py-4 px-4">
                                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Icon size={18} className="text-primary" />
                                    </div>
                                    <span className="text-sm font-medium">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {STATS.map((s) => (
                            <Reveal key={s.label}>
                                <div className="card card-hover text-center py-8">
                                    <p className="text-3xl font-extrabold text-gradient">{s.value}</p>
                                    <p className="text-text-secondary text-sm mt-1">{s.label}</p>
                                </div>
                            </Reveal>
                        ))}
                        <Reveal className="col-span-2">
                            <div className="card card-hover text-center py-8 flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                    <MapPin className="text-primary" size={24} />
                                </div>
                                <p className="font-bold">Headquartered in Mathura, Uttar Pradesh</p>
                                <p className="text-text-secondary text-sm max-w-md leading-relaxed">
                                    {SITE_TAGLINE}
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-14 border-t border-border">
                <div className="text-center mb-12">
                    <span className="section-label">Our Values</span>
                    <h2 className="text-3xl font-extrabold mt-3">What guides everything we do</h2>
                    <p className="section-desc text-base">Three principles, kept every single day.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: ShieldCheck, title: "Trust first", desc: "Every vehicle is inspected and every booking is verified by a real person before it is confirmed." },
                        { icon: Heart, title: "Service with devotion", desc: "We treat every journey like our own yatra — with respect, patience and care." },
                        { icon: Star, title: "Honest pricing", desc: "Clear per-day rates, no hidden fees, and full refunds on cancellation." },
                    ].map(({ icon: Icon, title, desc }, i) => (
                        <Reveal key={title} delay={i * 100}>
                            <div className="card card-hover p-6 text-center h-full">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                                    <Icon size={26} className="text-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-3">{title}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
                <div className="flex justify-center mt-10">
                    <Link href="/vehicles" className="btn-primary btn-lg">
                        Browse our vehicles <ChevronRight size={16} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
