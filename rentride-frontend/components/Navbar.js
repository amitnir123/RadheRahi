"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { Car, LogOut, LayoutDashboard, Menu, CalendarDays, Search } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Navbar() {
    const { user, fetchMe, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (pathname === "/login" || pathname === "/register") {
            useAuthStore.setState({ loading: false });
            // #region agent log
            fetch('http://127.0.0.1:7899/ingest/82c110a6-2006-4bf1-bd0d-bed474979303',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b83f93'},body:JSON.stringify({sessionId:'b83f93',runId:'post-fix',location:'Navbar.js:useEffect',message:'Navbar mount - skipped fetchMe on auth page',data:{pathname},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            return;
        }
        // #region agent log
        fetch('http://127.0.0.1:7899/ingest/82c110a6-2006-4bf1-bd0d-bed474979303',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b83f93'},body:JSON.stringify({sessionId:'b83f93',runId:'post-fix',location:'Navbar.js:useEffect',message:'Navbar mount - calling fetchMe',data:{pathname},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        fetchMe();
    }, [pathname]);

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out");
        router.push("/login");
    };

    const isActive = (href) => pathname === href || pathname?.startsWith(href + "/");

    const navLinkClass = (href) =>
        `flex items-center gap-1.5 text-sm transition-colors ${
            isActive(href)
                ? "text-primary font-medium"
                : "text-text-secondary hover:text-white"
        }`;

    return (
        <nav className="sticky top-0 z-50 bg-card border-b border-border">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                    <Car className="text-primary" size={24} />
                    <span className="text-xl font-bold text-white">
                        Rent<span className="text-primary">Ride</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-5">
                    {user ? (
                        <>
                            {/* Renter-specific links */}
                            {(user.role === "renter") && (
                                <>
                                    <Link href="/vehicles" className={navLinkClass("/vehicles")}>
                                        <Search size={15} />
                                        Browse
                                    </Link>
                                    <Link href="/bookings" className={navLinkClass("/bookings")}>
                                        <CalendarDays size={15} />
                                        My Bookings
                                    </Link>
                                </>
                            )}

                            {user.role === "admin" && (
                                <Link href="/admin/dashboard" className={navLinkClass("/admin/dashboard")}>
                                    <LayoutDashboard size={15} />
                                    Dashboard
                                </Link>
                            )}

                            {/* User info */}
                            <span className="text-text-secondary text-sm">
                                {user.fullname}
                                <span className="ml-1.5 text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full capitalize">
                                    {user.role}
                                </span>
                            </span>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-text-secondary hover:text-danger transition-colors text-sm"
                            >
                                <LogOut size={15} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-text-secondary hover:text-white transition-colors text-sm"
                            >
                                Login
                            </Link>
                            <Link href="/register" className="btn-primary text-sm">
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-text-secondary"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <Menu size={22} />
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-4">
                    {user ? (
                        <>
                            {(user.role === "renter") && (
                                <>
                                    <Link
                                        href="/vehicles"
                                        className="text-white flex items-center gap-2"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <Search size={15} /> Browse Vehicles
                                    </Link>
                                    <Link
                                        href="/bookings"
                                        className="text-white flex items-center gap-2"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <CalendarDays size={15} /> My Bookings
                                    </Link>
                                </>
                            )}
                            {user.role === "admin" && (
                                <Link
                                    href="/admin/dashboard"
                                    className="text-white flex items-center gap-2"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <LayoutDashboard size={15} /> Dashboard
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-danger text-left flex items-center gap-2"
                            >
                                <LogOut size={15} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-white" onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link href="/register" className="text-white" onClick={() => setMenuOpen(false)}>Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}