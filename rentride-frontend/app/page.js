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
            <section className="pt-4 pb-8 md:pt-8 md:pb-12 lg:pt-12 lg:pb-16">
                <HeroCarousel />
            </section>

            {/* Trust stats - combined with trust features */}
            <section className="section" id="trust">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 md:mb-16">
                    {STATS.map((s, i) => (
                        <Reveal key={s.label} delay={i * 80}>
                            <div className="card card-hover text-center py-8 md:py-10">
                                <p className="text-3xl md:text-4xl font-extrabold text-gradient">{s.value}</p>
                                <p className="text-text-secondary text-sm mt-2">{s.label}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div className="space-y-4">
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

            {/* Vehicle types */}
            <section className="section" id="vehicles">
                <PageHeader
                    eyebrow="Our Fleet"
                    title="What do you want to ride?"
                    description="Choose from verified cars, bikes, and scooters — all inspected and ready for your journey."
                    breadcrumbs={[{ label: "Vehicles", href: "/vehicles" }]}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {VEHICLE_TYPES.map(({ key, label, desc, href }, i) => {
                        const Icon = TYPE_ICON[key] || Car;
                        return (
                            <Reveal key={key} delay={i * 90}>
                                <Link
                                    href={href}
                                    className="card card-hover group text-center p-8"
                                >
                                    <div className="w-18 h-18 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary/15 transition-all">
                                        <Icon size={36} className="text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{label}</h3>
                                    <p className="text-text-secondary text-sm mb-6">{desc}</p>
                                    <span className="inline-flex items-center gap-1.5 text-primary text-sm font-medium group-hover:gap-2.5 transition-all">
                                        Explore <ChevronRight size={16} />
                                    </span>
                                </Link>
                            </Reveal>
                        );
                    })}
                </div>
            </section>

            {/* How it works */}
            <section className="section" id="how-it-works">
                <PageHeader
                    eyebrow="How It Works"
                    title="Book your ride in 5 simple steps"
                    description="A simple, transparent process designed for pilgrims and first-time renters alike."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {HOW_IT_WORKS.map((s, i) => (
                        <Reveal key={s.step} delay={i * 80}>
                            <div className="relative card card-hover text-center p-6">
                                <div className="w-14 h-14 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center mx-auto mb-5">
                                    {s.step}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                                <p className="text-text-secondary text-sm">{s.desc}</p>
                                {i < HOW_IT_WORKS.length - 1 && (
                                    <ChevronRight
                                        size={20}
                                        className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-border z-10"
                                    />
                                )}
                            </div>
                        </Reveal>
                    ))}
                </div>
                <Reveal>
                    <div className="flex justify-center mt-10">
                        <Link href="/how-it-works" className="btn-outline btn-lg">
                            Learn more
                        </Link>
                    </div>
                </Reveal>
            </section>

            {/* Destinations */}
            <section className="section" id="destinations">
                <PageHeader
                    eyebrow="Popular Destinations"
                    title="Explore the Braj region with ease"
                    description="From Mathura&apos;s temples to Vrindavan&apos;s galiyas — your next darshan is a ride away."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {DESTINATIONS.map((d, i) => (
                        <Reveal key={d.name} delay={(i % 3) * 90}>
                            <Link
                                href="/vehicles"
                                className="card card-hover group p-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                            {d.name}
                                        </h3>
                                        <p className="text-text-secondary text-sm mt-1.5">{d.desc}</p>
                                    </div>
                                    <MapPin className="text-primary flex-shrink-0 mt-0.5" size={22} />
                                </div>
                                <p className="text-xs text-text-secondary mt-5 flex items-center gap-1.5">
                                    <Clock size={12} className="text-primary" /> {d.time}
                                </p>
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
                <PageHeader
                    eyebrow="Testimonials"
                    title="Pilgrims love riding with us"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <Reveal key={t.name} delay={i * 100}>
                            <div className="card card-hover flex flex-col p-6 h-full">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, s) => (
                                        <Star key={s} size={16} className="text-warning fill-warning" />
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
                                        <p className="font-semibold text-sm">{t.name}</p>
                                        <p className="text-text-secondary text-xs">{t.place}</p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="section border-t border-border">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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
                        <div className="space-y-3">
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
