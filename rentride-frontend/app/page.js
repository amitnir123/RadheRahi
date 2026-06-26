"use client";
import Link from "next/link";
import { Car, Bike, Zap, Shield, Clock } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="max-w-7xl mx-auto px-4">
            {/* Hero */}
            <section className="py-24 text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Rent Any Vehicle
                    <br />
                    <span className="text-primary">Anytime. Anywhere.</span>
                </h1>
                <p className="text-text-secondary text-xl max-w-2xl mx-auto mb-10">
                    Cars, bikes, and scooters in Mathura, UP.
                    Book in minutes, ride in seconds.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                    <Link href="/vehicles" className="btn-primary text-base px-8 py-3">
                        Browse Vehicles
                    </Link>
                    <Link href="/register" className="btn-outline text-base px-8 py-3">
                        Create Account
                    </Link>
                </div>
            </section>

            {/* Vehicle Types */}
            <section className="py-16 border-t border-border">
                <h2 className="text-3xl font-bold text-center mb-12">
                    What do you want to ride?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: Car, label: "Cars", desc: "Comfortable rides for long trips", type: "car" },
                        { icon: Bike, label: "Bikes", desc: "Fast and fuel-efficient", type: "bike" },
                        { icon: Zap, label: "Scooters", desc: "Perfect for city commutes", type: "scooter" },
                    ].map(({ icon: Icon, label, desc, type }) => (
                        <Link
                            key={type}
                            href={`/vehicles?type=${type}`}
                            className="card hover:border-primary transition-colors group text-center"
                        >
                            <Icon
                                size={40}
                                className="text-primary mx-auto mb-4 group-hover:scale-110 transition-transform"
                            />
                            <h3 className="text-xl font-bold mb-2">{label}</h3>
                            <p className="text-text-secondary text-sm">{desc}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="py-16 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        { icon: Shield, title: "Verified Listings", desc: "All vehicles are listed and verified by our admin team" },
                        { icon: Clock, title: "Quick Booking", desc: "Book a vehicle in under 2 minutes" },
                        { icon: Car, title: "Mathura Coverage", desc: "Cars, bikes and scooters across Mathura, UP" },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div key={title}>
                            <Icon size={32} className="text-primary mx-auto mb-3" />
                            <h3 className="font-bold text-lg mb-2">{title}</h3>
                            <p className="text-text-secondary text-sm">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}