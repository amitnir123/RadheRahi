"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
    Calendar, User, Car, Bike, Zap,
    Check, X, CheckCircle, Loader2, CalendarX
} from "lucide-react";
import toast from "react-hot-toast";

const TABS = ["all", "pending", "accepted", "completed", "rejected", "cancelled"];
const TYPE_ICON = { car: Car, bike: Bike, scooter: Zap };

export default function OwnerBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [page, setPage] = useState(1);
    const [actionLoading, setActionLoading] = useState(null);
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeTab !== "all") params.set("status", activeTab);
            params.set("page", page);
            params.set("limit", 10);
            const res = await api.get(`/bookings/owner?${params.toString()}`);
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

    const handleAccept = async (bookingId) => {
        setActionLoading(bookingId);
        try {
            await api.patch(`/bookings/${bookingId}/accept`);
            toast.success("Booking accepted!");
            fetchBookings();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to accept");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async () => {
        setActionLoading(rejectModal);
        try {
            await api.patch(`/bookings/${rejectModal}/reject`, {
                reason: rejectReason || "Owner declined your request"
            });
            toast.success("Booking rejected");
            setRejectModal(null);
            setRejectReason("");
            fetchBookings();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reject");
        } finally {
            setActionLoading(null);
        }
    };

    const handleComplete = async (bookingId) => {
        setActionLoading(bookingId);
        try {
            await api.patch(`/bookings/${bookingId}/complete`);
            toast.success("Booking marked as completed!");
            fetchBookings();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to complete");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <ProtectedRoute roles={["owner", "admin"]}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-2">Booking Requests</h1>
                <p className="text-text-secondary mb-6">
                    {pagination.total || 0} total bookings on your vehicles
                </p>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setPage(1); }}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize transition-colors ${
                                activeTab === tab
                                    ? "bg-primary text-white"
                                    : "bg-card border border-border text-text-secondary hover:border-primary"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="animate-spin text-primary" size={36} />
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-24">
                        <CalendarX size={48} className="text-border mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No bookings found</h3>
                        <p className="text-text-secondary">No {activeTab !== "all" ? activeTab : ""} bookings yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map(b => {
                            const Icon = TYPE_ICON[b.vehicle?.type] || Car;
                            const isActioning = actionLoading === b._id;
                            return (
                                <div key={b._id} className="card">
                                    <div className="flex gap-4">
                                        {/* Vehicle image */}
                                        <div className="w-16 h-16 rounded-lg bg-border overflow-hidden flex-shrink-0">
                                            {b.vehicle?.images?.[0]?.url ? (
                                                <img src={b.vehicle.images[0].url} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Icon size={20} className="text-border" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold truncate">{b.vehicle?.name}</h3>
                                                <StatusBadge status={b.status} />
                                            </div>

                                            <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-1">
                                                <User size={13} className="text-primary" />
                                                {b.renter?.fullname}
                                                {b.renter?.phone && (
                                                    <span className="text-xs">· {b.renter.phone}</span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-2">
                                                <Calendar size={13} className="text-primary" />
                                                {formatDate(b.startDate)} → {formatDate(b.endDate)}
                                                <span className="text-xs">({b.totalDays}d)</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-primary">
                                                    {formatCurrency(b.totalPrice)}
                                                </span>
                                                <StatusBadge status={b.payment?.status || "unpaid"} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {b.status === "pending" && (
                                        <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                                            <button
                                                onClick={() => handleAccept(b._id)}
                                                disabled={isActioning}
                                                className="flex-1 flex items-center justify-center gap-2 bg-success/10 hover:bg-success/20 text-success border border-success/20 font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {isActioning ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => setRejectModal(b._id)}
                                                disabled={isActioning}
                                                className="flex-1 flex items-center justify-center gap-2 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <X size={14} />
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    {b.status === "accepted" && (
                                        <div className="mt-4 pt-4 border-t border-border">
                                            <button
                                                onClick={() => handleComplete(b._id)}
                                                disabled={isActioning}
                                                className="w-full flex items-center justify-center gap-2 bg-info/10 hover:bg-info/20 text-info border border-info/20 font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {isActioning ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                                Mark as Completed
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-outline text-sm disabled:opacity-40">Previous</button>
                        <span className="flex items-center px-4 text-text-secondary text-sm">{page} / {pagination.totalPages}</span>
                        <button disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)} className="btn-outline text-sm disabled:opacity-40">Next</button>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="card w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-2">Reject Booking</h2>
                        <p className="text-text-secondary text-sm mb-4">Provide a reason for the renter.</p>
                        <textarea
                            className="input-field resize-none h-20 mb-4"
                            placeholder="Reason for rejection..."
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                        />
                        <div className="flex gap-3">
                            <button onClick={() => { setRejectModal(null); setRejectReason(""); }} className="btn-outline flex-1">Cancel</button>
                            <button
                                onClick={handleReject}
                                disabled={actionLoading === rejectModal}
                                className="flex-1 bg-danger hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {actionLoading === rejectModal ? "Rejecting..." : "Reject"}

                            </button>
                            
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );

}