"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
    Car, CalendarCheck, Clock, IndianRupee,
    Plus, ChevronRight, Loader2
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function OwnerDashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [vRes, bRes] = await Promise.all([
                    api.get("/vehicles/my"),
                    api.get("/bookings/owner?limit=5")
                ]);
                setVehicles(vRes.data.data);
                setBookings(bRes.data.data.bookings);
            } catch {
                toast.error("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const totalVehicles = vehicles.length;
    const pendingVehicles = vehicles.filter(v => v.status === "pending").length;
    const approvedVehicles = vehicles.filter(v => v.status === "approved").length;
    const pendingBookings = bookings.filter(b => b.status === "pending").length;

    const stats = [
        { label: "Total Vehicles", value: totalVehicles, icon: Car, color: "text-primary" },
        { label: "Pending Approval", value: pendingVehicles, icon: Clock, color: "text-warning" },
        { label: "Approved", value: approvedVehicles, icon: CalendarCheck, color: "text-success" },
        { label: "Pending Bookings", value: pendingBookings, icon: IndianRupee, color: "text-info" },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={36} />
            </div>
        );
    }

    return (
        <ProtectedRoute roles={["owner", "admin"]}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
                        <p className="text-text-secondary mt-1">Manage your vehicles and bookings</p>
                    </div>
                    <Link href="/owner/vehicles/new" className="btn-primary flex items-center gap-2">
                        <Plus size={16} />
                        List Vehicle
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="card">
                            <Icon size={20} className={`${color} mb-3`} />
                            <p className="text-3xl font-bold mb-1">{value}</p>
                            <p className="text-text-secondary text-sm">{label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* My Vehicles */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-lg">My Vehicles</h2>
                            <Link href="/owner/vehicles" className="text-primary text-sm hover:underline flex items-center gap-1">
                                View all <ChevronRight size={14} />
                            </Link>
                        </div>
                        {vehicles.length === 0 ? (
                            <div className="text-center py-8">
                                <Car size={32} className="text-border mx-auto mb-3" />
                                <p className="text-text-secondary text-sm">No vehicles listed yet</p>
                                <Link href="/owner/vehicles/new" className="btn-primary text-sm mt-3 inline-block">
                                    List your first vehicle
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {vehicles.slice(0, 4).map(v => (
                                    <Link key={v._id} href={`/owner/vehicles`}>
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors">
                                            <div className="w-12 h-12 rounded-lg bg-border overflow-hidden flex-shrink-0">
                                                {v.images?.[0]?.url ? (
                                                    <img src={v.images[0].url} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Car size={16} className="text-border" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{v.name}</p>
                                                <p className="text-text-secondary text-xs">{formatCurrency(v.pricePerDay)}/day</p>
                                            </div>
                                            <StatusBadge status={v.status} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Booking Requests */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-lg">Recent Requests</h2>
                            <Link href="/owner/bookings" className="text-primary text-sm hover:underline flex items-center gap-1">
                                View all <ChevronRight size={14} />
                            </Link>
                        </div>
                        {bookings.length === 0 ? (
                            <div className="text-center py-8">
                                <CalendarCheck size={32} className="text-border mx-auto mb-3" />
                                <p className="text-text-secondary text-sm">No booking requests yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {bookings.map(b => (
                                    <Link key={b._id} href="/owner/bookings">
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate text-sm">{b.vehicle?.name}</p>
                                                <p className="text-text-secondary text-xs">
                                                    by {b.renter?.fullname} · {formatDate(b.startDate)}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <StatusBadge status={b.status} />
                                                <span className="text-primary text-xs font-medium">
                                                    {formatCurrency(b.totalPrice)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}