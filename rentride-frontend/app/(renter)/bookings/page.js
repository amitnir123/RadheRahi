"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import BookingCard from "@/components/BookingCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { CalendarX, Loader2, CreditCard, AlertCircle, Search, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

const TABS = ["all", "pending", "accepted", "completed", "cancelled", "rejected"];

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [page, setPage] = useState(1);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeTab !== "all") params.set("status", activeTab);
            params.set("page", page);
            params.set("limit", 10);

            const res = await api.get(`/bookings/my?${params.toString()}`);
            setBookings(res.data.data.bookings);
            setPagination(res.data.data.pagination);
        } catch {
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    }, [activeTab, page]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1);
    };

    // Bookings that are accepted but not yet paid
    const unpaidAccepted = bookings.filter(
        (b) => b.status === "accepted" && b.payment?.status !== "paid"
    );

    const emptyStates = {
        all: {
            icon: CalendarX,
            title: "No bookings yet",
            description: "Start your journey by booking a vehicle",
            action: <Link href="/vehicles" className="btn-primary">Browse Vehicles</Link>,
        },
        pending: {
            icon: Calendar,
            title: "No pending bookings",
            description: "Your booking requests will appear here",
        },
        accepted: {
            icon: AlertCircle,
            title: "No accepted bookings",
            description: "Approved bookings will show up here",
        },
        completed: {
            icon: Calendar,
            title: "No completed trips",
            description: "Your finished journeys will appear here",
        },
        cancelled: {
            icon: CalendarX,
            title: "No cancelled bookings",
            description: "Cancelled bookings will be listed here",
        },
        rejected: {
            icon: AlertCircle,
            title: "No rejected bookings",
            description: "Rejected requests will appear here",
        },
    };

    return (
        <ProtectedRoute roles={["renter", "admin"]}>
            <div className="container-page py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">My Bookings</h1>
                        <p className="text-text-secondary mt-1">
                            {pagination.total || 0} total bookings
                        </p>
                    </div>
                </div>

                {/* Payment Due Alert — shown when any accepted booking is unpaid */}
                {!loading && unpaidAccepted.length > 0 && (
                    <div className="mb-6 rounded-xl border border-warning/40 bg-warning/10 p-5">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-warning flex-shrink-0 mt-0.5" size={18} />
                            <div className="flex-1">
                                <p className="font-semibold text-warning">
                                    {unpaidAccepted.length === 1
                                        ? "You have 1 booking that needs payment"
                                        : `You have ${unpaidAccepted.length} bookings that need payment`}
                                </p>
                                <p className="text-text-secondary text-sm mt-0.5 mb-3">
                                    Your booking{unpaidAccepted.length > 1 ? "s have" : " has"} been accepted. Complete payment to confirm your ride.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    {unpaidAccepted.map((b) => (
                                        <Link
                                            key={b._id}
                                            href={`/payment/${b._id}`}
                                            className="inline-flex items-center gap-2 bg-warning text-black font-semibold text-sm px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
                                        >
                                            <CreditCard size={14} />
                                            Pay {formatCurrency(b.totalPrice)} for {b.vehicle?.name || "vehicle"}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                                activeTab === tab
                                    ? "bg-primary text-white"
                                    : "bg-card border border-border text-text-secondary hover:border-primary"
                            }`}
                        >
                            {tab}
                            {/* Show count badge on "accepted" tab if there are unpaid */}
                            {tab === "accepted" && unpaidAccepted.length > 0 && activeTab !== "accepted" && (
                                <span className="ml-1.5 badge-warning px-2 py-0.5 text-xs font-bold">
                                    {unpaidAccepted.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* List */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="card p-4 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 rounded-lg bg-border flex-shrink-0 skeleton" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-5 w-3/4 bg-border rounded skeleton" />
                                        <div className="h-4 w-1/2 bg-border rounded skeleton" />
                                        <div className="h-4 w-1/3 bg-border rounded skeleton" />
                                        <div className="h-6 w-24 bg-border rounded skeleton" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-16">
                        {(() => {
                            const Icon = emptyStates[activeTab].icon;
                            return <Icon size={48} className="text-border mx-auto mb-4" />;
                        })()}
                        <h3 className="text-xl font-bold mb-2">{emptyStates[activeTab].title}</h3>
                        <p className="text-text-secondary mb-6">{emptyStates[activeTab].description}</p>
                        {emptyStates[activeTab].action}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((b) => (
                            <BookingCard key={b._id} booking={b} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="btn-outline text-sm disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="flex items-center px-4 text-text-secondary text-sm">
                            {page} / {pagination.totalPages}
                        </span>
                        <button
                            disabled={page === pagination.totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="btn-outline text-sm disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}