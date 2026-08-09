"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Bike,
    Car,
    Clock3,
    MapPin,
    Pause,
    Play,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const slides = [
    {
        eyebrow: "MATHURA · THE LAND OF LORD KRISHNA",
        title: "Your Darshan Yatra, Your Ride",
        description:
            "Cars, bikes and scooters — verified, sanitised and ready for your holy journey across Braj.",
        location: "Mathura",
        meta: "Verified vehicles",
        icon: Car,
        type: "car",
    },
    {
        eyebrow: "VRINDAVAN · CITY OF TEMPLES",
        title: "Explore Vrindavan Without the Hassle",
        description:
            "Move between temples, ghats and hidden galiyas with a ride that is ready when you are.",
        location: "Vrindavan",
        meta: "Easy local travel",
        icon: Bike,
        type: "bike",
    },
    {
        eyebrow: "GOVARDHAN · SACRED PARIKRAMA",
        title: "Make Every Kilometer Count",
        description:
            "Choose the right ride for your parikrama and explore the Braj region at your own pace.",
        location: "Govardhan",
        meta: "Ideal for longer rides",
        icon: Car,
        type: "car",
    },
];

export default function HeroCarousel() {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    const slide = slides[active];
    const Icon = slide.icon;

    useEffect(() => {
        if (paused) return;

        const timer = setInterval(() => {
            setActive((current) => (current + 1) % slides.length);
        }, 6500);

        return () => clearInterval(timer);
    }, [paused]);

    const previous = () => {
        setActive((current) =>
            current === 0 ? slides.length - 1 : current - 1
        );
    };

    const next = () => {
        setActive((current) => (current + 1) % slides.length);
    };

    return (
        <div className="relative overflow-hidden rounded-[28px] min-h-[560px] md:min-h-[590px] bg-[#033c38] shadow-[0_20px_70px_rgba(0,0,0,0.12)]">
            {/* Background */}
            <div className="absolute inset-0">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#002f2c] via-[#064d48] to-[#1c1306]" />

                {/* Warm sun */}
                <div
                    className="
                        absolute
                        -right-20
                        -top-28
                        h-[420px]
                        w-[420px]
                        rounded-full
                        bg-amber-300/30
                        blur-[90px]
                    "
                />

                {/* Bottom warmth */}
                <div
                    className="
                        absolute
                        bottom-[-180px]
                        left-[20%]
                        h-[400px]
                        w-[600px]
                        rounded-full
                        bg-amber-700/20
                        blur-[100px]
                    "
                />

                {/* Subtle texture */}
                <div
                    className="
                        absolute inset-0 opacity-[0.08]
                        bg-[radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)]
                        [background-size:80px_80px]
                    "
                />

                {/* Dark text gradient */}
                <div
                    className="
                        absolute inset-0
                        bg-gradient-to-r
                        from-black/55
                        via-black/20
                        to-transparent
                    "
                />
            </div>

            {/* Decorative temple illustration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Main temple */}
                <div className="absolute right-[27%] top-[26%] hidden md:block">
                    <div className="relative h-[210px] w-[230px]">
                        <div className="absolute bottom-0 left-0 h-[130px] w-full rounded-t-sm bg-amber-950/70" />

                        <div className="absolute bottom-0 left-[25px] h-[120px] w-[42px] bg-amber-500/60" />
                        <div className="absolute bottom-0 right-[25px] h-[120px] w-[42px] bg-amber-500/60" />

                        <div className="absolute left-1/2 top-0 h-[105px] w-[75px] -translate-x-1/2 bg-amber-500/70" />

                        <div
                            className="
                                absolute
                                left-1/2
                                top-[-42px]
                                -translate-x-1/2
                                border-l-[38px]
                                border-r-[38px]
                                border-b-[45px]
                                border-l-transparent
                                border-r-transparent
                                border-b-amber-500/70
                            "
                        />

                        <div className="absolute left-1/2 top-[18px] h-3 w-3 -translate-x-1/2 rounded-full bg-amber-800/70" />
                    </div>
                </div>

                {/* Smaller temple */}
                <div className="absolute right-[7%] bottom-[16%] hidden lg:block">
                    <div className="relative h-[160px] w-[150px]">
                        <div className="absolute bottom-0 left-0 h-[100px] w-full bg-amber-950/60" />
                        <div className="absolute bottom-0 left-[25px] h-[90px] w-[35px] bg-amber-400/50" />
                        <div className="absolute bottom-0 right-[25px] h-[90px] w-[35px] bg-amber-400/50" />

                        <div className="absolute left-1/2 top-[5px] h-[80px] w-[50px] -translate-x-1/2 bg-amber-500/60" />

                        <div
                            className="
                                absolute
                                left-1/2
                                top-[-30px]
                                -translate-x-1/2
                                border-l-[25px]
                                border-r-[25px]
                                border-b-[32px]
                                border-l-transparent
                                border-r-transparent
                                border-b-amber-500/60
                            "
                        />
                    </div>
                </div>

                {/* Floating stars */}
                <div className="absolute left-[10%] top-[20%] h-1.5 w-1.5 rounded-full bg-amber-300/70" />
                <div className="absolute left-[37%] top-[18%] h-1 w-1 rounded-full bg-amber-200/60" />
                <div className="absolute right-[33%] top-[14%] h-1.5 w-1.5 rounded-full bg-amber-200/70" />
                <div className="absolute right-[8%] top-[20%] h-1 w-1 rounded-full bg-white/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex min-h-[560px] md:min-h-[590px] items-center">
                <div className="w-full px-7 py-16 sm:px-10 md:px-14 lg:px-16">
                    <div className="max-w-[680px]">
                        {/* Eyebrow */}
                        <div
                            key={`eyebrow-${active}`}
                            className="
                                inline-flex items-center gap-2
                                rounded-full
                                border border-white/20
                                bg-white/10
                                px-4 py-2
                                text-[11px] font-semibold tracking-[0.12em]
                                text-white/90
                                backdrop-blur-md
                            "
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                            {slide.eyebrow}
                        </div>

                        {/* Heading */}
                        <h1
                            key={`title-${active}`}
                            className="
                                mt-7
                                max-w-[650px]
                                text-4xl
                                font-black
                                leading-[0.98]
                                tracking-[-0.045em]
                                text-white
                                sm:text-5xl
                                md:text-6xl
                                lg:text-[68px]
                            "
                        >
                            {slide.title}
                        </h1>

                        {/* Description */}
                        <p
                            key={`description-${active}`}
                            className="
                                mt-7
                                max-w-[590px]
                                text-base
                                leading-7
                                text-white/75
                                md:text-lg
                            "
                        >
                            {slide.description}
                        </p>

                        {/* Actions */}
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <Link
                                href="/vehicles"
                                className="
                                    inline-flex items-center justify-center
                                    rounded-xl
                                    bg-primary
                                    px-6 py-3.5
                                    text-sm font-bold text-white
                                    shadow-lg shadow-primary/20
                                    transition-all
                                    hover:-translate-y-0.5
                                    hover:brightness-110
                                "
                            >
                                Browse Vehicles
                            </Link>

                            <Link
                                href="/how-it-works"
                                className="
                                    inline-flex items-center justify-center
                                    rounded-xl
                                    border border-white/25
                                    bg-white/10
                                    px-6 py-3.5
                                    text-sm font-semibold text-white
                                    backdrop-blur-md
                                    transition-all
                                    hover:bg-white/15
                                "
                            >
                                How it works
                            </Link>
                        </div>

                        {/* Trust information */}
                        <div className="mt-9 flex flex-wrap gap-5 text-xs text-white/65">
                            <div className="flex items-center gap-2">
                                <ShieldCheck
                                    size={15}
                                    className="text-teal-300"
                                />
                                Verified vehicles
                            </div>

                            <div className="flex items-center gap-2">
                                <Sparkles
                                    size={15}
                                    className="text-amber-300"
                                />
                                Sanitised before pickup
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock3
                                    size={15}
                                    className="text-teal-300"
                                />
                                Ready on time
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom location card */}
            <div
                className="
                    absolute bottom-6 left-6 z-20
                    hidden sm:flex
                    items-center gap-3
                    rounded-2xl
                    border border-white/15
                    bg-black/20
                    px-4 py-3
                    backdrop-blur-xl
                "
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                    <MapPin size={17} className="text-teal-300" />
                </div>

                <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-white/50">
                        Exploring
                    </p>
                    <p className="text-sm font-semibold text-white">
                        {slide.location}
                    </p>
                </div>
            </div>

            {/* Carousel controls */}
            <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
                {/* Progress */}
                <div className="mr-2 flex items-center gap-1.5">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            aria-label={`Go to slide ${index + 1}`}
                            onClick={() => setActive(index)}
                            className={`
                                h-1.5 rounded-full transition-all duration-300
                                ${
                                    index === active
                                        ? "w-8 bg-primary"
                                        : "w-1.5 bg-white/40 hover:bg-white/70"
                                }
                            `}
                        />
                    ))}
                </div>

                {/* Pause */}
                <button
                    onClick={() => setPaused((value) => !value)}
                    aria-label={paused ? "Play carousel" : "Pause carousel"}
                    className="
                        flex h-10 w-10 items-center justify-center
                        rounded-full
                        border border-white/20
                        bg-black/20
                        text-white
                        backdrop-blur-md
                        transition-all
                        hover:bg-white/15
                    "
                >
                    {paused ? (
                        <Play size={14} fill="currentColor" />
                    ) : (
                        <Pause size={14} />
                    )}
                </button>

                {/* Previous */}
                <button
                    onClick={previous}
                    aria-label="Previous slide"
                    className="
                        flex h-10 w-10 items-center justify-center
                        rounded-full
                        border border-white/20
                        bg-white/10
                        text-white
                        backdrop-blur-md
                        transition-all
                        hover:bg-white/20
                    "
                >
                    <ArrowLeft size={17} />
                </button>

                {/* Next */}
                <button
                    onClick={next}
                    aria-label="Next slide"
                    className="
                        flex h-10 w-10 items-center justify-center
                        rounded-full
                        bg-white
                        text-zinc-900
                        shadow-lg
                        transition-all
                        hover:scale-105
                    "
                >
                    <ArrowRight size={17} />
                </button>
            </div>

            {/* Slide number */}
            <div className="absolute right-6 top-6 z-20 text-xs font-medium text-white/50">
                <span className="text-white">
                    {String(active + 1).padStart(2, "0")}
                </span>
                <span className="mx-1">/</span>
                {String(slides.length).padStart(2, "0")}
            </div>
        </div>
    );
}