"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ChevronLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { DEFAULT_CITY, DEFAULT_STATE } from "@/lib/constants";

const VEHICLE_TYPES = ["car", "bike", "scooter"];

export default function AdminEditVehiclePage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: "", type: "car", brand: "", model: "",
        year: "", pricePerDay: "", description: "",
        vehicleNo: "", ownerName: "",
        city: DEFAULT_CITY, state: DEFAULT_STATE
    });

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get(`/vehicles/${id}`);
                const v = res.data.data;
                setForm({
                    name: v.name || "",
                    type: v.type || "car",
                    brand: v.brand || "",
                    model: v.model || "",
                    year: v.year || "",
                    pricePerDay: v.pricePerDay || "",
                    description: v.description || "",
                    vehicleNo: v.vehicleNo || "",
                    ownerName: v.ownerName || "",
                    city: v.location?.city || DEFAULT_CITY,
                    state: v.location?.state || DEFAULT_STATE
                });
            } catch {
                toast.error("Vehicle not found");
                router.push("/admin/vehicles/manage");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch(`/vehicles/${id}`, form);
            toast.success("Vehicle updated. Re-submitted for approval if it was approved.");
            router.push("/admin/vehicles/manage");
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setSaving(false);
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
            <div className="max-w-2xl mx-auto px-4 py-8">
                <Link
                    href="/admin/vehicles/manage"
                    className="flex items-center gap-1.5 text-text-secondary hover:text-white transition-colors mb-6 text-sm"
                >
                    <ChevronLeft size={16} /> Back to my listings
                </Link>

                <h1 className="text-3xl font-bold mb-2">Edit Vehicle</h1>
                <p className="text-text-secondary mb-8">
                    Editing an approved vehicle will reset it to pending for re-approval.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="card space-y-4">
                        <h2 className="font-semibold">Owner & Registration</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Vehicle Number</label>
                                <input
                                    className="input-field"
                                    value={form.vehicleNo}
                                    onChange={e => setForm({ ...form, vehicleNo: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Owner Name</label>
                                <input
                                    className="input-field"
                                    value={form.ownerName}
                                    onChange={e => setForm({ ...form, ownerName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card space-y-4">
                        <h2 className="font-semibold">Basic Information</h2>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Vehicle Name</label>
                            <input
                                className="input-field"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Type</label>
                            <div className="grid grid-cols-3 gap-3">
                                {VEHICLE_TYPES.map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setForm({ ...form, type: t })}
                                        className={`py-2.5 rounded-lg border text-sm font-medium capitalize transition-colors ${
                                            form.type === t
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border text-text-secondary hover:border-primary/50"
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Brand</label>
                                <input
                                    className="input-field"
                                    value={form.brand}
                                    onChange={e => setForm({ ...form, brand: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Model</label>
                                <input
                                    className="input-field"
                                    value={form.model}
                                    onChange={e => setForm({ ...form, model: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Year</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={form.year}
                                    onChange={e => setForm({ ...form, year: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Price per Day (₹)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={form.pricePerDay}
                                    onChange={e => setForm({ ...form, pricePerDay: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Description</label>
                            <textarea
                                className="input-field resize-none h-24"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="card space-y-4">
                        <h2 className="font-semibold">Location</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">City</label>
                                <input
                                    className="input-field"
                                    value={form.city}
                                    onChange={e => setForm({ ...form, city: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">State</label>
                                <input
                                    className="input-field"
                                    value={form.state}
                                    onChange={e => setForm({ ...form, state: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary w-full py-3 text-base"
                    >
                        {saving ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </span>
                        ) : "Save Changes"}
                    </button>
                </form>
            </div>
        </ProtectedRoute>
    );
}
