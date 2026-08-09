import Link from "next/link";
import {
    ShieldCheck, ShieldAlert, Lock, BadgeCheck,
    Headphones, IdCard, Wrench, Phone, Clipboard,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { SITE_PHONE } from "@/lib/constants";

export const metadata = {
    title: "Safety & Trust | RentRide — Vehicle Rental in Mathura & Vrindavan",
    description: "How RentRide keeps your ride safe and your booking secure — verified vehicles, admin-confirmed bookings and secure payments.",
};

export default function SafetyPage() {
    return (
        <div className="container-page pb-10">

            <div className="mb-12 py-10 text-center">
                <span className="section-label">Safety & Trust</span>

                <h2 className="section-title text-3xl md:text-4xl lg:text-5xl mt-3">
                    Your safety is our first promise
                </h2>
                <h3 className="section-desc text-base md:text-lg mt-2">
                    From verified vehicles to secure payments and admin-confirmed bookings, everything about RentRide is designed so you can ride with complete peace of mind.
                </h3>
            </div>

            {/* Trust pillars */}
            <section className="py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { icon: BadgeCheck, title: "Admin-verified vehicles", desc: "No vehicle is listed until our Mathura team inspects it. This means no surprises, no unroadworthy rides, and no fake listings — ever." },
                        { icon: Clipboard, title: "Confirmed bookings, every time", desc: "A real person reviews each request and confirms availability before you pay. You will never land at an empty lot." },
                        { icon: Lock, title: "Secure payments", desc: "All payments run through Razorpay, India's leading payment gateway. Your card and bank details are never stored on our servers." },
                        { icon: IdCard, title: "ID verification", desc: "Drivers are verified against a valid driving licence at pickup, protecting both you and the fleet." },
                        { icon: Wrench, title: "Well-maintained fleet", desc: "Vehicles are regularly serviced, cleaned and sanitised between bookings, especially during the festive yatra season." },
                        { icon: Headphones, title: "24×7 local support", desc: "Our Mathura-based team is available around the clock by phone for help, changes or roadside assistance." },
                    ].map(({ icon: Icon, title, desc }, i) => (
                        <Reveal key={title} delay={(i % 2) * 100}>
                            <div className="card card-hover p-6 h-full">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center flex-shrink-0">
                                        <Icon size={22} className="text-success" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">{title}</h3>
                                        <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* What to do */}
            <section className="py-14 border-t border-border">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Reveal>
                        <div className="card card-hover p-6 md:p-8 h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-11 h-11 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck className="text-success" size={22} />
                                </div>
                                <h2 className="text-xl font-bold">How we protect you</h2>
                            </div>
                            <ul className="space-y-3.5 text-sm text-text-secondary">
                                {[
                                    "All listings are reviewed and approved by admin before going live.",
                                    "Bookings are confirmed by our team before any payment is taken.",
                                    "Payments are processed over encrypted connections via Razorpay.",
                                    "Clear cancellation and refund policy — full refund on cancellation.",
                                    "Contact details of our local team shared with every confirmed booking.",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                                            <span className="w-1.5 h-1.5 rounded-full bg-success" />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>
                    <Reveal delay={120}>
                        <div className="card card-hover p-6 md:p-8 h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-11 h-11 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center flex-shrink-0">
                                    <ShieldAlert className="text-warning" size={22} />
                                </div>
                                <h2 className="text-xl font-bold">How you can stay safe</h2>
                            </div>
                            <ul className="space-y-3.5 text-sm text-text-secondary">
                                {[
                                    "Keep a valid driving licence and photo ID ready at pickup.",
                                    "Carry and check the vehicle registration number at pickup.",
                                    "Only pay through our secure Razorpay checkout — never to a personal account.",
                                    "Report any issue to our 24×7 support immediately — we will resolve it.",
                                    "Return the vehicle on time and in the same condition to avoid charges.",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                                            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-10">
                    <a href={`tel:+91${SITE_PHONE}`} className="btn-primary btn-lg inline-flex items-center gap-2">
                        <Phone size={16} /> Call 24×7 support
                    </a>
                    <Link href="/vehicles" className="btn-outline btn-lg">Browse verified vehicles</Link>
                </div>
            </section>
        </div>
    );
}
