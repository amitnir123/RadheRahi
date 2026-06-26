"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Upload, X, ChevronLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { DEFAULT_CITY, DEFAULT_STATE } from "@/lib/constants";

const VEHICLE_TYPES = ["car", "bike", "scooter"];

export default function AdminNewVehiclePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [form, setForm] = useState({
        name: "", type: "car", brand: "", model: "",
        year: "", pricePerDay: "", description: "",
        vehicleNo: "", ownerName: "",
        city: DEFAULT_CITY, state: DEFAULT_STATE
    });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            toast.error("Maximum 5 images allowed");
            return;
        }
        setImages(prev => [...prev, ...files]);
        const newPreviews = files.map(f => URL.createObjectURL(f));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0) {
            toast.error("At least one image is required");
            return;
        }
        setLoading(true);

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (v) formData.append(k, v);
            });
            images.forEach(img => formData.append("images", img));

            await api.post("/vehicles", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.success("Vehicle listed! Approve it from the vehicles page.");
            router.push("/admin/vehicles/manage");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to list vehicle");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute roles={["admin"]}>
            <div className="max-w-2xl mx-auto px-4 py-8">
                <Link
                    href="/admin/vehicles/manage"
                    className="flex items-center gap-1.5 text-text-secondary hover:text-white transition-colors mb-6 text-sm"
                >
                    <ChevronLeft size={16} /> Back to my listings
                </Link>

                <h1 className="text-3xl font-bold mb-2">List a Vehicle</h1>
                <p className="text-text-secondary mb-8">
                    Add vehicle details. Approve the listing from the vehicles page to make it visible to renters.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="card">
                        <h2 className="font-semibold mb-4">Vehicle Images</h2>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            {previews.map((src, i) => (
                                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-border">
                                    <img src={src} className="w-full h-full object-cover" alt="" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 hover:bg-danger transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            {previews.length < 5 && (
                                <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center cursor-pointer">
                                    <Upload size={20} className="text-text-secondary mb-1" />
                                    <span className="text-text-secondary text-xs">Add Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                        <p className="text-text-secondary text-xs">{images.length}/5 images · Max 5MB each</p>
                    </div>

                    <div className="card space-y-4">
                        <h2 className="font-semibold">Owner & Registration</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Vehicle Number</label>
                                <input
                                    className="input-field"
                                    placeholder="e.g. UP85 AB 1234"
                                    value={form.vehicleNo}
                                    onChange={e => setForm({ ...form, vehicleNo: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Owner Name</label>
                                <input
                                    className="input-field"
                                    placeholder="Vehicle owner's name"
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
                                placeholder="e.g. Honda Activa 6G"
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
                                    placeholder="Honda"
                                    value={form.brand}
                                    onChange={e => setForm({ ...form, brand: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Model</label>
                                <input
                                    className="input-field"
                                    placeholder="Activa 6G"
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
                                    placeholder="2022"
                                    min="1990"
                                    max={new Date().getFullYear() + 1}
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
                                    placeholder="500"
                                    min="0"
                                    value={form.pricePerDay}
                                    onChange={e => setForm({ ...form, pricePerDay: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Description (optional)</label>
                            <textarea
                                className="input-field resize-none h-24"
                                placeholder="Describe vehicle condition, features..."
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
                        disabled={loading}
                        className="btn-primary w-full py-3 text-base"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 size={18} className="animate-spin" />
                                Submitting...
                            </span>
                        ) : "Submit Listing"}
                    </button>
                </form>
            </div>
        </ProtectedRoute>
    );
}
