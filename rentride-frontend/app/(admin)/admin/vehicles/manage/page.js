"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { Car, Plus, Pencil, Trash2, Loader2, Bike, Zap } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const TYPE_ICON = { car: Car, bike: Bike, scooter: Zap };

export default function AdminManageVehiclesPage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const fetchVehicles = async () => {
        try {
            const res = await api.get("/vehicles/my");
            setVehicles(res.data.data);
        } catch {
            toast.error("Failed to load vehicles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/vehicles/${id}`);
            toast.success("Vehicle deleted");
            setVehicles(v => v.filter(x => x._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        } finally {
            setDeleteId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={36} />
            </div>
        );
    }

    return (
        <ProtectedRoute roles={["admin"]}>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">My Listings</h1>
                        <p className="text-text-secondary mt-1">{vehicles.length} vehicles listed</p>
                    </div>
                    <Link href="/admin/vehicles/new" className="btn-primary flex items-center gap-2">
                        <Plus size={16} />
                        Add Vehicle
                    </Link>
                </div>

                {vehicles.length === 0 ? (
                    <div className="text-center py-24">
                        <Car size={48} className="text-border mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No vehicles yet</h3>
                        <p className="text-text-secondary mb-6">Start by listing a vehicle</p>
                        <Link href="/admin/vehicles/new" className="btn-primary">
                            List Your First Vehicle
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {vehicles.map(v => {
                            const Icon = TYPE_ICON[v.type] || Car;
                            return (
                                <div key={v._id} className="card flex gap-4 items-center">
                                    <div className="w-20 h-20 rounded-lg bg-border overflow-hidden flex-shrink-0">
                                        {v.images?.[0]?.url ? (
                                            <img src={v.images[0].url} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Icon size={24} className="text-border" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h3 className="font-bold truncate">{v.name}</h3>
                                            <StatusBadge status={v.status} />
                                        </div>
                                        <p className="text-text-secondary text-sm">
                                            {v.brand} {v.model} · {v.year}
                                        </p>
                                        <p className="text-text-secondary text-xs mt-0.5">
                                            {v.vehicleNo} · Owner: {v.ownerName}
                                        </p>
                                        <p className="text-primary font-semibold text-sm mt-1">
                                            {formatCurrency(v.pricePerDay)}/day
                                        </p>
                                        {v.rejectionReason && (
                                            <p className="text-danger text-xs mt-1">
                                                Rejected: {v.rejectionReason}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Link
                                            href={`/admin/vehicles/${v._id}/edit`}
                                            className="p-2 rounded-lg border border-border hover:border-primary text-text-secondary hover:text-white transition-colors"
                                        >
                                            <Pencil size={16} />
                                        </Link>
                                        <button
                                            onClick={() => setDeleteId(v._id)}
                                            className="p-2 rounded-lg border border-border hover:border-danger text-text-secondary hover:text-danger transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {deleteId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="card w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-2">Delete Vehicle?</h2>
                        <p className="text-text-secondary text-sm mb-6">
                            This will permanently delete the vehicle and all its images.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 bg-danger hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}
