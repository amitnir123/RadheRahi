"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { Car, LogOut, LayoutDashboard, Menu } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Navbar() {
    const { user, fetchMe, logout } = useAuthStore();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        fetchMe();
    }, []);

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out");
        router.push("/login");
    };

    const dashboardLink =
        user?.role === "admin"
            ? "/admin/dashboard"
            : user?.role === "owner"
            ? "/owner/dashboard"
            : "/vehicles";

    return (
        <nav className="sticky top-0 z-50 bg-card border-b border-border">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Car className="text-primary" size={24} />
                    <span className="text-xl font-bold text-white">
                        Rent<span className="text-primary">Ride</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            <Link
                                href={dashboardLink}
                                className="flex items-center gap-1.5 text-text-secondary hover:text-white transition-colors"
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </Link>
                            <span className="text-text-secondary text-sm">
                                {user.fullname}
                                <span className="ml-1.5 text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full capitalize">
                                    {user.role}
                                </span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-text-secondary hover:text-danger transition-colors"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-text-secondary hover:text-white transition-colors"
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
                            <Link href={dashboardLink} className="text-white">Dashboard</Link>
                            <button onClick={handleLogout} className="text-danger text-left">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-white">Login</Link>
                            <Link href="/register" className="text-white">Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}