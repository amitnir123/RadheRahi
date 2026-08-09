import Link from "next/link";
import {
    Car, Bike, Zap, Shield, ShieldCheck, Clock, Wallet,
    MapPin, Star, Phone, ChevronRight, BadgePercent, Headphones,
} from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import {
    STATS, VEHICLE_TYPES, HOW_IT_WORKS, TRUST_FEATURES,
    DESTINATIONS, TESTIMONIALS, FAQS, SITE_PHONE,
} from "@/lib/constants";

const TYPE_ICON = { car: Car, bike: Bike, scooter: Zap };

export default function LandingPage() {
    return (
        <div className="container-page">
            {/* Hero carousel */}
            <section className="section pt-4">
                <HeroCarousel />
            </section>

            {/* Trust stats - combined with trust features */}
            <section className="section" id="trust">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 md:mb-20">
                    {STATS.map((s, i) => (
                        <Reveal key={s.label} delay={i * 80}>
                            <div className="card card-hover text-center py-8 md:py-10">
                                <p className="text-3xl md:text-4xl font-extrabold text-gradient">{s.value}</p>
                                <p className="text-text-secondary text-sm mt-2">{s.label}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    <Reveal>
                        <div className="pr-8 lg:pr-12">
                            <span className="section-label">Why RentRide</span>
                            <h2 className="section-title text-2xl md:text-3xl lg:text-4xl mt-3 mb-6">
                                Built on trust, for your{" "}
                                <span className="text-gradient">holy journey</span>
                            </h2>
                            <p className="text-text-secondary leading-relaxed mb-8 text-lg">
                                We know a peaceful yatra depends on a dependable ride. That&apos;s why every
                                vehicle on RentRide is verified by our Mathura team before it is listed, and
                                every booking is personally confirmed by an admin.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {TRUST_FEATURES.map((f) => (
                                    <div key={f.title} className="flex items-start gap-4 p-4 card-hover rounded-xl border border-border bg-card/50 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <ShieldCheck className="text-success" size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm mb-1">{f.title}</p>
                                            <p className="text-text-secondary text-sm">{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                    <div className="space-y-8">
                        {[
                            { icon: Shield, title: "Admin-verified fleet", desc: "Every car, bike and scooter is inspected before listing." },
                            { icon: Wallet, title: "No hidden charges", desc: "The price you see is the price you pay — nothing more." },
                            { icon: Clock, title: "On-time pickup", desc: "Vehicles ready at your chosen pickup place at the booked time." },
                            { icon: Headphones, title: "Local 24×7 support", desc: "A real Mathura-based team whenever you need help." },
                        ].map(({ icon: Icon, title, desc }, i) => (
                            <Reveal key={title} delay={i * 100}>
                                <div className="card card-hover flex items-start gap-4 p-5">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                                        <Icon size={22} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold">{title}</p>
                                        <p className="text-text-secondary text-sm mt-1">{desc}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>



            {/* Destinations */}
            <section className="section" id="destinations">
                <div className="mb-12">
                    <span className="section-label">Popular Destinations</span>

                    <h2 className="section-title text-3xl md:text-4xl lg:text-5xl mt-3">
                        Explore the Braj region with ease
                    </h2>

                    <p className="text-text-secondary text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
                        From Mathura&apos;s temples to Vrindavan&apos;s galiyas — your next
                        darshan is a ride away.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                    {DESTINATIONS.map((d, i) => (
                        <Reveal key={d.name} delay={(i % 3) * 90}>
                            <Link
                                href="/vehicles"
                                className="
                        group block h-full
                        rounded-2xl
                        border border-border
                        bg-card
                        p-6
                        transition-all duration-300
                        hover:-translate-y-1
                        hover:border-primary/40
                        hover:shadow-lg
                    "
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">
                                            {d.name}
                                        </h3>

                                        <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                                            {d.desc}
                                        </p>
                                    </div>

                                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                                        <MapPin
                                            className="text-primary"
                                            size={18}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-border flex items-center gap-2">
                                    <Clock
                                        size={13}
                                        className="text-primary flex-shrink-0"
                                    />

                                    <span className="text-xs text-text-secondary">
                                        {d.time}
                                    </span>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>
            {/* Offers banner */}
            <section className="section" id="offers">
                <Reveal>
                    <div className="card relative overflow-hidden bg-gradient-to-br from-primary/10 via-card to-card border-primary/30 p-8 md:p-12 lg:p-16">
                        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-0 bottom-0 w-1/3 bg-white/50 blur-2xl animate-shimmer" />
                        </div>
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
                                    <BadgePercent size={32} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold">
                                        Pilgrim special — up to 20% off
                                    </h2>
                                    <p className="text-text-secondary mt-3 max-w-lg text-lg">
                                        Book your darshan yatra vehicle this week and save on every ride.
                                        Use the offer at checkout. Offer valid for a limited time.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Link href="/vehicles" className="btn-primary btn-lg">
                                    Grab the offer
                                </Link>
                                <Link href="/register" className="btn-outline btn-lg">
                                    Create account
                                </Link>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* Testimonials */}
            <section className="section">
                <div className="mb-12">
                    <span className="section-label">Testimonials</span>

                    <h2 className="section-title text-3xl md:text-4xl lg:text-5xl mt-3">
                        Pilgrims love riding with us
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                    {TESTIMONIALS.map((t, i) => (
                        <Reveal key={t.name} delay={i * 100}>
                            <div className="card card-hover flex flex-col p-6 h-full">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, s) => (
                                        <Star
                                            key={s}
                                            size={16}
                                            className="text-warning fill-warning"
                                        />
                                    ))}
                                </div>

                                <p className="text-text-secondary text-sm leading-relaxed flex-1">
                                    &ldquo;{t.text}&rdquo;
                                </p>

                                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                                    <div className="w-11 h-11 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">
                                        {t.name.charAt(0)}
                                    </div>

                                    <div>
                                        <p className="font-semibold text-sm">
                                            {t.name}
                                        </p>
                                        <p className="text-text-secondary text-xs">
                                            {t.place}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="section border-t border-border">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    <Reveal>
                        <div>
                            <span className="section-label">FAQs</span>
                            <h2 className="section-title text-2xl md:text-3xl lg:text-4xl mt-3 mb-4">
                                Frequently asked questions
                            </h2>
                            <p className="text-text-secondary mb-6 text-lg">
                                Can&apos;t find your answer? Our team in Mathura is happy to help.
                            </p>
                            <a
                                href={`tel:+91${SITE_PHONE}`}
                                className="inline-flex items-center gap-2.5 btn-outline btn-lg"
                            >
                                <Phone size={18} className="text-primary" />
                                Call +91 {SITE_PHONE}
                            </a>
                        </div>
                    </Reveal>
                    <Reveal delay={120}>
                        <div className="space-y-5">
                            {FAQS.map((f) => (
                                <details key={f.q} className="card card-hover group p-5">
                                    <summary className="font-semibold cursor-pointer list-none flex items-center justify-between gap-4">
                                        {f.q}
                                        <span className="text-primary text-2xl leading-none group-open:rotate-45 transition-transform flex-shrink-0">
                                            +
                                        </span>
                                    </summary>
                                    <p className="text-text-secondary text-sm mt-4 leading-relaxed">
                                        {f.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}
