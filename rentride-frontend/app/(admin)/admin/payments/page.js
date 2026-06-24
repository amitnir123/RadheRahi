"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { IndianRupee, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const STATUSES = ["all", "pending", "paid", "refunded", "failed"];

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [pagination, setPagination] = useState({});
    const [breakdown, setBreakdown] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (status !== "all") params.set("status", status);
            params.set("page", page);
            params.set("limit", 15);
            const res = await api.get(`/admin/payments?${params.toString()}`);
            setPayments(res.data.data.payments);
            setPagination(res.data.data.pagination);
            setBreakdown(res.data.data.revenueBreakdown || []);
        } catch {
            toast.error("Failed to load payments");
        } finally {
            setLoading(false);
        }
    }, [status, page]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const paidBreakdown = breakdown.find(b => b._id === "paid");
    const refundedBreakdown = breakdown.find(b => b._id === "refunded");

    return (
        <ProtectedRoute roles={["admin"]}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Payments</h1>
                    <p className="text-text-secondary mt-1">{pagination.total || 0} total transactions</p>
                </div>

                {/* Revenue Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="card">
                        <IndianRupee size={20} className="text-success mb-2" />
                        <p className="text-2xl font-bold text-success">
                            {formatCurrency(paidBreakdown?.total || 0)}
                        </p>
                        <p className="text-text-secondary text-sm">
                            Total Revenue · {paidBreakdown?.count || 0} transactions
                        </p>
                    </div>
                    <div className="card">
                        <IndianRupee size={20} className="text-refunded mb-2" />
                        <p className="text-2xl font-bold text-refunded">
                            {formatCurrency(refundedBreakdown?.total || 0)}
                        </p>
                        <p className="text-text-secondary text-sm">
                            Total Refunded · {refundedBreakdown?.count || 0} transactions
                        </p>
                    </div>
                    <div className="card">
                        <IndianRupee size={20} className="text-primary mb-2" />
                        <p className="text-2xl font-bold text-primary">
                            {formatCurrency((paidBreakdown?.total || 0) - (refundedBreakdown?.total || 0))}
                        </p>
                        <p className="text-text-secondary text-sm">Net Revenue</p>
                    </div>
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
                ) : payments.length === 0 ? (
                    <div className="text-center py-24">
                        <IndianRupee size={48} className="text-border mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No payments found</h3>
                    </div>
                ) : (
                    <div className="card p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Renter</th>
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Amount</th>
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Status</th>
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Razorpay Order</th>
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Paid At</th>
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Refunded At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map(p => (
                                        <tr key={p._id} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-medium">{p.renter?.fullname}</p>
                                                <p className="text-text-secondary text-xs">{p.renter?.email}</p>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-primary">
                                                {formatCurrency(p.amount)}
                                                {p.refundAmount && (
                                                    <p className="text-refunded text-xs font-normal">
                                                        Refund: {formatCurrency(p.refundAmount)}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={p.status} />
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-text-secondary max-w-32 truncate">
                                                {p.razorpayOrderId}
                                            </td>
                                            <td className="px-4 py-3 text-text-secondary text-xs">
                                                {p.paidAt ? formatDate(p.paidAt) : "—"}
                                            </td>
                                            <td className="px-4 py-3 text-text-secondary text-xs">
                                                {p.refundedAt ? formatDate(p.refundedAt) : "—"}
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