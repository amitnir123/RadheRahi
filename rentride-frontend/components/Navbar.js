"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import useAuthStore from "@/store/authStore";
import { Car, LogOut, LayoutDashboard, Menu, CalendarDays, Search, ShieldCheck, Phone, X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { PUBLIC_NAV_LINKS, SITE_PHONE } from "@/lib/constants";

export default function Navbar() {
    const { user, fetchMe, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    useEffect(() => {
        if (pathname === "/login" || pathname === "/register") {
            useAuthStore.setState({ loading: false });
            return;
        }
        fetchMe();
    }, [pathname]);

    // Close menus on route change
    useEffect(() => {
        setMenuOpen(false);
        setUserMenuOpen(false);
    }, [pathname]);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out");
        router.push("/login");
    };

    const isActive = (href) => pathname === href || pathname?.startsWith(href + "/");

    const navLinkClass = (href) =>
        `flex items-center gap-1.5 text-sm font-medium transition-colors ${
            isActive(href)
                ? "text-primary"
                : "text-text-secondary hover:text-primary"
        }`;

    return (
        <>
            {/* Trust top bar */}
            <div className="bg-primary/5 border-b border-primary/10">
                <div className="container-page h-9 flex items-center justify-between text-xs">
                    <p className="flex items-center gap-2 text-text-secondary">
                        <ShieldCheck size={13} className="text-primary flex-shrink-0" />
                        <span className="hidden sm:inline">
                            Verified vehicles · Transparent pricing · Secure payments
                        </span>
                        <span className="sm:hidden">Verified &amp; secure</span>
                    </p>
                    <a
                        href={`tel:+91${SITE_PHONE}`}
                        className="flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors"
                    >
                        <Phone size={12} className="text-primary" />
                        <span className="hidden sm:inline">24×7 Support: +91 {SITE_PHONE}</span>
                        <span className="sm:hidden">+91 {SITE_PHONE}</span>
                    </a>
                </div>
            </div>

            <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-border animate-in fade-in-0 slide-in-from-top-2 duration-500 ease-out">
                <div className="container-page h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Car className="text-primary" size={20} />
                        </div>
                        <span className="text-xl font-bold text-foreground tracking-tight">
                            Rent<span className="text-primary">Ride</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {/* Public links */}
                        {PUBLIC_NAV_LINKS.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    isActive(l.href)
                                        ? "text-primary bg-primary/5 font-medium"
                                        : "text-text-secondary hover:text-primary hover:bg-muted"
                                } text-sm`}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                {/* Renter-specific links (desktop) */}
                                {user.role === "renter" && (
                                    <>
                                        <Link href="/vehicles" className={`${navLinkClass("/vehicles")} hidden xl:flex`}>
                                            <Search size={15} />
                                            Browse
                                        </Link>
                                        <Link href="/bookings" className={`${navLinkClass("/bookings")} hidden xl:flex`}>
                                            <CalendarDays size={15} />
                                            My Bookings
                                        </Link>
                                    </>
                                )}
                                {user.role === "admin" && (
                                    <Link href="/admin/dashboard" className={`${navLinkClass("/admin/dashboard")} hidden xl:flex`}>
                                        <LayoutDashboard size={15} />
                                        Dashboard
                                    </Link>
                                )}

                                {/* User dropdown */}
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-border hover:border-primary/40 hover:bg-muted transition-all"
                                    >
                                        <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                                            {user.fullname?.charAt(0)?.toUpperCase() || "U"}
                                        </span>
                                        <span className="text-sm font-medium hidden md:block max-w-[100px] truncate">
                                            {user.fullname}
                                        </span>
                                        <ChevronDown size={14} className={`text-text-secondary transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl py-2 animate-in scale-in">
                                            <div className="px-4 py-3 border-b border-border mb-1">
                                                <p className="font-semibold text-sm truncate">{user.fullname}</p>
                                                <p className="text-text-secondary text-xs capitalize">{user.role}</p>
                                            </div>
                                            {user.role === "renter" && (
                                                <div className="md:hidden">
                                                    <Link href="/vehicles" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                                                        <Search size={15} className="text-primary" /> Browse Vehicles
                                                    </Link>
                                                    <Link href="/bookings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                                                        <CalendarDays size={15} className="text-primary" /> My Bookings
                                                    </Link>
                                                </div>
                                            )}
                                            {user.role === "admin" && (
                                                <div className="md:hidden">
                                                    <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                                                        <LayoutDashboard size={15} className="text-primary" /> Dashboard
                                                    </Link>
                                                </div>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors"
                                            >
                                                <LogOut size={15} />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Link href="/login" className="btn-ghost btn-md">
                                    Login
                                </Link>
                                <Link href="/register" className="btn-primary btn-md">
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden text-text-secondary hover:text-primary transition-colors p-2"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu overlay */}
                {menuOpen && (
                    <div className="lg:hidden fixed inset-0 top-0 z-50">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setMenuOpen(false)} />
                        <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                            <div className="flex items-center justify-between px-6 h-16 border-b border-border">
                                <Link href="/" className="flex items-center gap-2">
                                    <Car className="text-primary" size={22} />
                                    <span className="text-lg font-bold">RadheRahi</span>
                                </Link>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="text-text-secondary p-2"
                                    aria-label="Close menu"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
                                {user ? (
                                    <>
                                        {user.role === "renter" && (
                                            <>
                                                <Link href="/vehicles" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors">
                                                    <Search size={18} className="text-primary" />
                                                    <span className="font-medium">Browse Vehicles</span>
                                                </Link>
                                                <Link href="/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors">
                                                    <CalendarDays size={18} className="text-primary" />
                                                    <span className="font-medium">My Bookings</span>
                                                </Link>
                                            </>
                                        )}
                                        {user.role === "admin" && (
                                            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors">
                                                <LayoutDashboard size={18} className="text-primary" />
                                                <span className="font-medium">Dashboard</span>
                                            </Link>
                                        )}
                                        <div className="divider my-3" />
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2 mb-4">
                                        <Link href="/login" className="btn-outline btn-lg justify-center">Login</Link>
                                        <Link href="/register" className="btn-primary btn-lg justify-center">Register</Link>
                                        <div className="divider my-3" />
                                    </div>
                                )}

                                {PUBLIC_NAV_LINKS.filter((l) => l.href !== "/").map((l) => (
                                    <Link
                                        key={l.href}
                                        href={l.href}
                                        className={`px-4 py-3 rounded-xl transition-colors ${
                                            isActive(l.href) ? "bg-primary/5 text-primary" : "hover:bg-muted"
                                        }`}
                                    >
                                        {l.label}
                                    </Link>
                                ))}
                            </div>

                            <div className="border-t border-border p-6">
                                {user ? (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="w-9 h-9 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                                                {user.fullname?.charAt(0)?.toUpperCase() || "U"}
                                            </span>
                                            <div>
                                                <p className="font-medium text-sm">{user.fullname}</p>
                                                <p className="text-text-secondary text-xs capitalize">{user.role}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="text-danger p-2 hover:bg-danger/5 rounded-lg transition-colors"
                                            aria-label="Logout"
                                        >
                                            <LogOut size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <a
                                        href={`tel:+91${SITE_PHONE}`}
                                        className="flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
                                    >
                                        <Phone size={15} className="text-primary" />
                                        24×7 Support: +91 {SITE_PHONE}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
