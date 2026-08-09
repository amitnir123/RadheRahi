import Link from "next/link";
import {
    Search, CalendarRange, ClipboardCheck, CreditCard, KeyRound,
    ShieldCheck, BadgePercent, Wallet, ChevronRight, Phone,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { HOW_IT_WORKS, SITE_PHONE } from "@/lib/constants";

export const metadata = {
    title: "How It Works | RentRide — Vehicle Rental in Mathura & Vrindavan",
    description: "A simple 5-step guide to booking a verified car, bike or scooter with RentRide in Mathura and Vrindavan.",
};

const STEP_ICONS = [Search, CalendarRange, ClipboardCheck, CreditCard, KeyRound];

export default function HowItWorksPage() {
    return (
        <div className="container-page pb-10">
            <PageHeader
                eyebrow="How It Works"
                title="From browse to ride in minutes"
                description="Renting a vehicle for your darshan yatra is simple. Follow these five steps and you will be on the road in no time."
            />

            {/* Steps */}
            <section className="py-14">
                <div className="grid grid-cols-1 gap-5 max-w-4xl mx-auto">
                    {HOW_IT_WORKS.map((s, i) => {
                        const Icon = STEP_ICONS[i] || Search;
                        return (
                            <Reveal key={s.step} delay={i * 80}>
                                <div className="card card-hover p-6 flex flex-col sm:flex-row items-start gap-5">
                                    <div className="flex items-center gap-4 sm:w-56 flex-shrink-0">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                <Icon size={24} className="text-primary" />
                                            </div>
                                            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                                                {s.step}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-secondary uppercase tracking-wider mb-0.5">
                                                Step {s.step}
                                            </p>
                                            <p className="font-bold text-base">{s.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 flex-1">
                                        <ChevronRight size={18} className="text-border flex-shrink-0 mt-0.5 hidden sm:block" />
                                        <p className="text-text-secondary text-sm leading-relaxed sm:pt-0.5">
                                            {s.desc}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </section>

            {/* Good to know */}
            <section className="py-14 border-t border-border">
                <div className="text-center mb-12">
                    <span className="section-label">Good to Know</span>
                    <h2 className="text-3xl font-extrabold mt-3">Before you book</h2>
                    <p className="section-desc text-base">Everything you need to prepare for a smooth pickup.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: ShieldCheck, title: "What you need", desc: "A valid driving licence and a government photo ID are required at pickup." },
                        { icon: Wallet, title: "Payment & refunds", desc: "Pay securely via Razorpay after admin confirmation. Full refund on cancellation." },
                        { icon: BadgePercent, title: "Pilgrim specials", desc: "Keep an eye on the homepage for limited-time discounts on yatra bookings." },
                    ].map(({ icon: Icon, title, desc }, i) => (
                        <Reveal key={title} delay={i * 100}>
                            <div className="card card-hover p-6 h-full">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                                    <Icon size={24} className="text-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{title}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 mt-10">
                    <Link href="/vehicles" className="btn-primary btn-lg">Browse vehicles</Link>
                    <Link href="/register" className="btn-outline btn-lg">Create an account</Link>
                    <a href={`tel:+91${SITE_PHONE}`} className="btn-outline btn-lg">
                        <Phone size={16} className="text-primary" /> Ask a question
                    </a>
                </div>
            </section>
        </div>
    );
}
