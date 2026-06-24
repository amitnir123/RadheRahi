"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import BookingCard from "@/components/BookingCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { CalendarX, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

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

    return (
        <ProtectedRoute roles={["renter", "admin"]}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
                <p className="text-text-secondary mb-6">
                    {pagination.total || 0} total bookings
                </p>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
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
                        </button>
                    ))}
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="animate-spin text-primary" size={36} />
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-24">
                        <CalendarX size={48} className="text-border mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No bookings found</h3>
                        <p className="text-text-secondary">
                            {activeTab === "all"
                                ? "You have not made any bookings yet"
                                : `No ${activeTab} bookings`}
                        </p>
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
                    <div className="flex justify-center gap-2 mt-8">
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