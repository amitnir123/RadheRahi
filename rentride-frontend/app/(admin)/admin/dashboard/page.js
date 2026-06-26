"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import { formatCurrency } from "@/lib/utils";
import {
    Users, Car, CalendarCheck, IndianRupee,
    Clock, CheckCircle, XCircle, ChevronRight, Loader2, Activity
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get("/admin/stats");
                setStats(res.data.data);
            } catch {
                toast.error("Failed to load stats");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={36} />
            </div>
        );
    }

    const statCards = [
        {
            label: "Total Users",
            value: stats?.users?.total || 0,
            sub: `${stats?.users?.admins || 0} admins · ${stats?.users?.renters || 0} renters`,
            icon: Users,
            color: "text-primary",
            href: "/admin/users"
        },
        {
            label: "Total Vehicles",
            value: stats?.vehicles?.total || 0,
            sub: `${stats?.vehicles?.pending || 0} pending approval`,
            icon: Car,
            color: "text-warning",
            href: "/admin/vehicles"
        },
        {
            label: "Total Bookings",
            value: stats?.bookings?.total || 0,
            sub: `${stats?.bookings?.active || 0} active · ${stats?.bookings?.completed || 0} completed`,
            icon: CalendarCheck,
            color: "text-success",
            href: "/admin/bookings"
        },
        {
            label: "Total Revenue",
            value: formatCurrency(stats?.payments?.totalRevenue || 0),
            sub: `${stats?.payments?.paid || 0} paid transactions`,
            icon: IndianRupee,
            color: "text-info",
            href: "/admin/payments"
        },
    ];

    const quickLinks = [
        {
            label: "Pending Vehicle Approvals",
            value: stats?.vehicles?.pending || 0,
            icon: Clock,
            color: "text-warning bg-warning/10 border-warning/20",
            href: "/admin/vehicles?status=pending"
        },
        {
            label: "Approved Vehicles",
            value: stats?.vehicles?.approved || 0,
            icon: CheckCircle,
            color: "text-success bg-success/10 border-success/20",
            href: "/admin/vehicles?status=approved"
        },
        {
            label: "Active Bookings",
            value: stats?.bookings?.active || 0,
            icon: CalendarCheck,
            color: "text-info bg-info/10 border-info/20",
            href: "/admin/bookings?status=accepted"
        },
        {
            label: "Completed Bookings",
            value: stats?.bookings?.completed || 0,
            icon: XCircle,
            color: "text-text-secondary bg-border/30 border-border",
            href: "/admin/bookings?status=completed"
        },
    ];

    return (
        <ProtectedRoute roles={["admin"]}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-text-secondary mt-1">Platform overview</p>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map(({ label, value, sub, icon: Icon, color, href }) => (
                        <Link key={label} href={href}>
                            <div className="card hover:border-primary transition-colors group">
                                <div className="flex items-center justify-between mb-3">
                                    <Icon size={20} className={color} />
                                    <ChevronRight size={14} className="text-border group-hover:text-primary transition-colors" />
                                </div>
                                <p className="text-2xl font-bold mb-1">{value}</p>
                                <p className="text-text-secondary text-sm font-medium mb-1">{label}</p>
                                <p className="text-text-secondary text-xs">{sub}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Action Links */}
                <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {quickLinks.map(({ label, value, icon: Icon, color, href }) => (
                        <Link key={label} href={href}>
                            <div className={`flex items-center gap-3 p-4 rounded-xl border hover:opacity-80 transition-opacity ${color}`}>
                                <Icon size={18} />
                                <div>
                                    <p className="text-xl font-bold">{value}</p>
                                    <p className="text-xs">{label}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Nav Cards */}
                <h2 className="font-bold text-lg mb-4">Manage</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {[
                        { label: "Users", desc: "View and manage all users", href: "/admin/users", icon: Users },
                        { label: "List Vehicles", desc: "Add new vehicle listings", href: "/admin/vehicles/new", icon: Car },
                        { label: "Approve Vehicles", desc: "Approve or reject listings", href: "/admin/vehicles", icon: Car },
                        { label: "Bookings", desc: "Accept, reject and complete bookings", href: "/admin/bookings", icon: CalendarCheck },
                        { label: "Payments", desc: "Track revenue and refunds", href: "/admin/payments", icon: IndianRupee },
                        { label: "Live Monitor", desc: "Real-time platform activity", href: "/admin/monitor", icon: Activity },
                    ].map(({ label, desc, href, icon: Icon }) => (
                        <Link key={label} href={href}>
                            <div className="card hover:border-primary transition-colors group h-full">
                                <Icon size={24} className="text-primary mb-3" />
                                <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{label}</h3>
                                <p className="text-text-secondary text-sm">{desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </ProtectedRoute>
    );
}