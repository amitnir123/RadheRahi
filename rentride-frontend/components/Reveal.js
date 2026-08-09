"use client";
import { useEffect, useRef, useState } from "react";

export default function Reveal({ children, delay = 0, className = "", once = true, threshold = 0.1, rootMargin = "0px 0px -50px 0px" }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);
        const handler = (e) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // If reduced motion, show immediately
        if (prefersReducedMotion) {
            setVisible(true);
            return;
        }

        if (typeof IntersectionObserver === "undefined") {
            const t = setTimeout(() => setVisible(true), delay);
            return () => clearTimeout(t);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const timer = setTimeout(() => {
                        setVisible(true);
                    }, delay);
                    if (once) observer.disconnect();
                    return () => clearTimeout(timer);
                } else if (!once) {
                    setVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay, once, threshold, rootMargin, prefersReducedMotion]);

    const baseStyles = {
        transitionDelay: `${delay}ms`,
        willChange: "transform, opacity",
    };

    return (
        <div
            ref={ref}
            style={visible ? { ...baseStyles, opacity: 1, transform: "translateY(0)" } : { ...baseStyles, opacity: 0, transform: "translateY(20px)" }}
            className={`transition-all duration-700 ease-out ${className}`}
        >
            {children}
        </div>
    );
}
