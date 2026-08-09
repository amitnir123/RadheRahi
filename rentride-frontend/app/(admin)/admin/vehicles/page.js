"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Car, Bike, Zap, Check, X, Loader2, Plus, ListChecks, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const STATUSES = ["all", "pending", "approved", "rejected"];
const TYPE_ICON = { car: Car, bike: Bike, scooter: Zap };

export default function AdminVehiclesPage() {
    return (
        <Suspense fallback={null}>
            <AdminVehiclesContent />
        </Suspense>
    );
}

function AdminVehiclesContent() {
    const searchParams = useSearchParams();
    const [vehicles, setVehicles] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(searchParams.get("status") || "all");
    const [page, setPage] = useState(1);
    const [actionId, setActionId] = useState(null);
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    const fetchVehicles = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (status !== "all") params.set("status", status);
            params.set("page", page);
            params.set("limit", 10);
            const res = await api.get(`/admin/vehicles?${params.toString()}`);
            setVehicles(res.data.data.vehicles);
            setPagination(res.data.data.pagination);
        } catch {
            toast.error("Failed to load vehicles");
        } finally {
            setLoading(false);
        }
    }, [status, page]);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const handleApprove = async (id) => {
        setActionId(id);
        try {
            await api.patch(`/vehicles/${id}/approve`);
            toast.success("Vehicle approved");
            fetchVehicles();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to approve");
        } finally {
            setActionId(null);
        }
    };

    const handleReject = async () => {
        setActionId(rejectModal);
        try {
            await api.patch(`/vehicles/${rejectModal}/reject`, {
                reason: rejectReason || "Did not meet platform requirements"
            });
            toast.success("Vehicle rejected");
            setRejectModal(null);
            setRejectReason("");
            fetchVehicles();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reject");
        } finally {
            setActionId(null);
        }
    };

    return (
        <ProtectedRoute roles={["admin"]}>
            <div className="container-page py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Vehicle Approvals</h1>
                        <p className="text-text-secondary mt-1">{pagination.total || 0} vehicles</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Link href="/admin/vehicles/manage" className="btn-outline text-sm">
                            <ListChecks size={16} /> My Listings
                        </Link>
                        <Link href="/admin/vehicles/new" className="btn-primary text-sm">
                            <Plus size={16} /> Add Vehicle
                        </Link>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
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
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="card p-5">
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 rounded-lg skeleton flex-shrink-0" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-5 w-1/3 skeleton rounded" />
                                        <div className="h-4 w-1/2 skeleton rounded" />
                                        <div className="h-4 w-1/4 skeleton rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="text-center py-24">
                        <Car size={48} className="text-border mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No vehicles found</h3>
                        <p className="text-text-secondary mb-6">No vehicles match the selected status.</p>
                        <Link href="/admin/vehicles/new" className="btn-primary">
                            <Plus size={16} /> Add your first vehicle
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {vehicles.map(v => {
                            const Icon = TYPE_ICON[v.type] || Car;
                            const isActioning = actionId === v._id;
                            return (
                                <div key={v._id} className="card p-5">
                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <div className="w-20 h-20 rounded-lg bg-border overflow-hidden flex-shrink-0">
                                            {v.images?.[0]?.url ? (
                                                <img src={v.images[0].url} className="w-full h-full object-cover" alt={v.name} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Icon size={24} className="text-border" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className="font-bold">{v.name}</h3>
                                                <StatusBadge status={v.status} size="sm" />
                                                <span className="badge badge-neutral capitalize">
                                                    {v.type}
                                                </span>
                                            </div>
                                            <p className="text-text-secondary text-sm mb-1">
                                                {v.brand} {v.model} · {v.year}
                                            </p>
                                            <p className="text-text-secondary text-sm mb-1">
                                                {v.vehicleNo} · Owner: {v.ownerName}
                                            </p>
                                            <p className="flex items-center gap-1.5 text-text-secondary text-sm mb-1">
                                                <MapPin size={13} className="text-primary" />
                                                {v.location?.city}, {v.location?.state}
                                            </p>
                                            <div className="flex items-center gap-4 mt-1 flex-wrap">
                                                <span className="text-primary font-semibold text-sm">
                                                    {formatCurrency(v.pricePerDay)}/day
                                                </span>
                                                <span className="text-text-secondary text-xs">
                                                    Listed: {formatDate(v.createdAt)}
                                                </span>
                                            </div>
                                            {v.rejectionReason && (
                                                <p className="text-danger text-xs mt-1">
                                                    Reason: {v.rejectionReason}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions — only for pending */}
                                    {v.status === "pending" && (
                                        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-border">
                                            <button
                                                onClick={() => handleApprove(v._id)}
                                                disabled={isActioning}
                                                className="flex-1 flex items-center justify-center gap-2 bg-success/10 hover:bg-success/20 text-success border border-success/20 font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {isActioning ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => setRejectModal(v._id)}
                                                disabled={isActioning}
                                                className="flex-1 flex items-center justify-center gap-2 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <X size={14} />
                                                Reject
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
                    <div className="flex justify-center gap-2 mt-10">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-outline text-sm disabled:opacity-40">Previous</button>
                        <span className="flex items-center px-4 text-text-secondary text-sm">{page} / {pagination.totalPages}</span>
                        <button disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)} className="btn-outline text-sm disabled:opacity-40">Next</button>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in">
                    <div className="card w-full max-w-sm p-6 animate-in scale-in">
                        <h2 className="text-xl font-bold mb-2">Reject Vehicle</h2>
                        <p className="text-text-secondary text-sm mb-4">Provide a reason for rejection.</p>
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
                                disabled={actionId === rejectModal}
                                className="flex-1 bg-danger hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {actionId === rejectModal ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Rejecting...
                                    </>
                                ) : "Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}