"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CalendarCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const STATUSES = ["all", "pending", "accepted", "completed", "cancelled", "rejected"];

export default function AdminBookingsPage() {
    const searchParams = useSearchParams();
    const [bookings, setBookings] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(searchParams.get("status") || "all");
    const [page, setPage] = useState(1);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (status !== "all") params.set("status", status);
            params.set("page", page);
            params.set("limit", 15);
            const res = await api.get(`/admin/bookings?${params.toString()}`);
            setBookings(res.data.data.bookings);
            setPagination(res.data.data.pagination);
        } catch {
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    }, [status, page]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return (
        <ProtectedRoute roles={["admin"]}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Bookings</h1>
                    <p className="text-text-secondary mt-1">{pagination.total || 0} total bookings</p>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                    {STATUSES.map(s => (
                        <button
                            key={s}
                            onClick={() => { setStatus(s); setPage(1); }}
                            className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                                status === s
                                    ? "bg-primary text-white"
                                    : "bg-card border border-border text-text-secondary hover:border-primary"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="animate-spin text-primary" size={36} />
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-24">
                        <CalendarCheck size={48} className="text-border mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No bookings found</h3>
                    </div>
                ) : (
                    <div className="card p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Vehicle</th>
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Renter</th>
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Owner</th>
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Dates</th>
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Amount</th>
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Status</th>
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Payment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b._id} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-sm">{b.vehicle?.name}</p>
                                                <p className="text-text-secondary text-xs capitalize">{b.vehicle?.type}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm">{b.renter?.fullname}</p>
                                                <p className="text-text-secondary text-xs">{b.renter?.email}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm">{b.owner?.fullname}</p>
                                                <p className="text-text-secondary text-xs">{b.owner?.email}</p>
                                            </td>
                                            <td className="px-4 py-3 text-text-secondary text-xs">
                                                <p>{formatDate(b.startDate)}</p>
                                                <p>{formatDate(b.endDate)}</p>
                                                <p className="text-primary">{b.totalDays}d</p>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-primary text-sm">
                                                {formatCurrency(b.totalPrice)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={b.status} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={b.payment?.status || "unpaid"} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-outline text-sm disabled:opacity-40">Previous</button>
                        <span className="flex items-center px-4 text-text-secondary text-sm">{page} / {pagination.totalPages}</span>
                        <button disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)} className="btn-outline text-sm disabled:opacity-40">Next</button>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}