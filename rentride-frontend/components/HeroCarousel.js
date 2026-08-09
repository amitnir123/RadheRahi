"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { HERO_SLIDES } from "@/lib/constants";

const AUTOPLAY_MS = 7000;

export default function HeroCarousel() {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [failedMedia, setFailedMedia] = useState({});
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const goTo = useCallback((i) => {
        setIndex(((i % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length);
    }, []);

    useEffect(() => {
        if (paused || HERO_SLIDES.length <= 1) return;
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % HERO_SLIDES.length);
        }, AUTOPLAY_MS);
        return () => clearInterval(timer);
    }, [paused]);

    const slide = HERO_SLIDES[index];

    return (
        <section className="relative" aria-label="Hero carousel">
            <div
                className={`relative overflow-hidden rounded-2xl md:rounded-3xl border border-border bg-card ${
                    isMobile ? "h-[420px]" : "h-[520px] md:h-[600px]"
                }`}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {/* Slides */}
                {HERO_SLIDES.map((s, i) => {
                    const active = i === index;
                    const hasMedia = !!s.media && !failedMedia[s.id];
                    return (
                        <div
                            key={s.id}
                            className={`absolute inset-0 transition-opacity duration-700 ${
                                active ? "opacity-100" : "opacity-0 pointer-events-none"
                            }`}
                        >
                            {/* Fallback gradient always behind */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${s.gradient}`}
                            />
                            {hasMedia &&
                                (s.type === "video" ? (
                                    <video
                                        src={s.media}
                                        className={`absolute inset-0 w-full h-full object-cover ${
                                            active ? "animate-ken-burns" : ""
                                        }`}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        onError={() =>
                                            setFailedMedia((f) => ({ ...f, [s.id]: true }))
                                        }
                                    />
                                ) : (
                                    <img
                                        src={s.media}
                                        alt={s.headline}
                                        className={`absolute inset-0 w-full h-full object-cover ${
                                            active ? "animate-ken-burns" : ""
                                        }`}
                                        onError={() =>
                                            setFailedMedia((f) => ({ ...f, [s.id]: true }))
                                        }
                                    />
                                ))}
                            {/* Readability scrim - stronger for better text contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                        </div>
                    );
                })}

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-12">
                    <div className="max-w-2xl mx-auto w-full text-center md:text-left">
                        <p
                            key={`e-${slide.id}`}
                            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-teal-100 mb-4 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 w-fit animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ease-out"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-200 animate-pulse" />
                            {slide.eyebrow}
                        </p>
                        <h1
                            key={`h-${slide.id}`}
                            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight text-white mb-4 animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ease-out delay-100 text-balance"
                        >
                            {slide.headline}
                        </h1>
                        <p
                            key={`s-${slide.id}`}
                            className="text-white/90 text-base md:text-lg lg:text-xl max-w-xl md:max-w-2xl mb-6 lg:mb-8 animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ease-out delay-200"
                        >
                            {slide.sub}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ease-out delay-300">
                            <Link href={slide.cta.href} className="btn-primary btn-lg text-white">
                                {slide.cta.label}
                            </Link>
                            <Link
                                href={slide.ctaSecondary.href}
                                className="btn-outline btn-lg text-white border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/50"
                            >
                                {slide.ctaSecondary.label}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center gap-1.5">
                    <button
                        onClick={() => setPaused((p) => !p)}
                        aria-label={paused ? "Play" : "Pause"}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/70 backdrop-blur border border-white/40 text-foreground flex items-center justify-center hover:bg-white/90 transition-colors"
                    >
                        {paused ? <Play size={16} /> : <Pause size={16} />}
                    </button>
                    <button
                        onClick={() => goTo(index - 1)}
                        aria-label="Previous slide"
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/70 backdrop-blur border border-white/40 text-foreground flex items-center justify-center hover:bg-white/90 transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() => goTo(index + 1)}
                        aria-label="Next slide"
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/70 backdrop-blur border border-white/40 text-foreground flex items-center justify-center hover:bg-white/90 transition-colors"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-6 md:left-auto md:translate-x-0 md:right-6 flex items-center gap-1.5">
                    {HERO_SLIDES.map((s, i) => (
                        <button
                            key={s.id}
                            onClick={() => goTo(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === index
                                    ? "w-8 bg-teal-200"
                                    : "w-1.5 bg-white/40 hover:bg-white/70"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
