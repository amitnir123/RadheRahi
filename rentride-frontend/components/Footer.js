import Link from "next/link";
import {
    Car, MapPin, Phone, Mail, Clock,
    ShieldCheck, Heart,
} from "lucide-react";
import {
    SITE_NAME, SITE_TAGLINE, SITE_PHONE, SITE_EMAIL, SITE_ADDRESS,
    SITE_HOURS, FOOTER_LINKS, SOCIAL_LINKS,
} from "@/lib/constants";

export default function Footer() {
    return (
        <footer className="border-t border-border bg-card/50 mt-20">
            {/* CTA strip */}
            <div className="border-b border-border">
                <div className="container-page py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-center md:text-left">
                        <div className="w-14 h-14 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="text-success" size={28} />
                        </div>
                        <div>
                            <p className="font-bold text-lg">
                                Ready for your darshan yatra?
                            </p>
                            <p className="text-text-secondary text-sm mt-0.5">
                                {SITE_TAGLINE}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/vehicles" className="btn-primary">
                            Book a Vehicle
                        </Link>
                        <Link href="/contact" className="btn-outline">
                            Talk to Us
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main footer */}
            <div className="container-page py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Car className="text-primary" size={22} />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">
                                Rent<span className="text-primary">Ride</span>
                            </span>
                        </Link>
                        <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-sm">
                            {SITE_TAGLINE}
                        </p>
                        <ul className="space-y-3 text-sm text-text-secondary">
                            <li className="flex items-start gap-2.5">
                                <MapPin size={15} className="text-primary flex-shrink-0 mt-0.5" />
                                <span>
                                    {SITE_ADDRESS.line1}, {SITE_ADDRESS.city}, {SITE_ADDRESS.state}{" "}
                                    {SITE_ADDRESS.pincode}
                                </span>
                            </li>
                            <li>
                                <a
                                    href={`tel:+91${SITE_PHONE}`}
                                    className="flex items-center gap-2.5 hover:text-primary transition-colors"
                                >
                                    <Phone size={15} className="text-primary flex-shrink-0" />
                                    +91 {SITE_PHONE}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`mailto:${SITE_EMAIL}`}
                                    className="flex items-center gap-2.5 hover:text-primary transition-colors"
                                >
                                    <Mail size={15} className="text-primary flex-shrink-0" />
                                    {SITE_EMAIL}
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Clock size={15} className="text-primary flex-shrink-0" />
                                {SITE_HOURS}
                            </li>
                        </ul>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="font-bold text-foreground mb-4">Explore</h3>
                        <ul className="space-y-3 text-sm">
                            {FOOTER_LINKS.explore.map((l) => (
                                <li key={l.label}>
                                    <Link
                                        href={l.href}
                                        className="text-text-secondary hover:text-primary transition-colors"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-bold text-foreground mb-4">Company</h3>
                        <ul className="space-y-3 text-sm">
                            {FOOTER_LINKS.company.map((l) => (
                                <li key={l.label}>
                                    <Link
                                        href={l.href}
                                        className="text-text-secondary hover:text-primary transition-colors"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-foreground mb-4">Support</h3>
                        <ul className="space-y-3 text-sm">
                            {FOOTER_LINKS.support.map((l) => (
                                <li key={l.label}>
                                    <a
                                        href={l.href}
                                        className="text-text-secondary hover:text-primary transition-colors"
                                    >
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <h3 className="font-bold text-foreground mt-8 mb-4">Follow Us</h3>
                        <div className="flex flex-wrap gap-2">
                            {SOCIAL_LINKS.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target={s.external ? "_blank" : undefined}
                                    rel={s.external ? "noopener noreferrer" : undefined}
                                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-text-secondary hover:text-primary hover:border-primary transition-colors"
                                >
                                    {s.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-border">
                <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-text-secondary text-center sm:text-left">
                        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. Made with{" "}
                        <Heart size={12} className="inline text-danger" /> in Mathura, Braj.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck size={13} className="text-success" />
                            Secure payments via Razorpay
                        </span>
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck size={13} className="text-info" />
                            Verified vehicles
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
