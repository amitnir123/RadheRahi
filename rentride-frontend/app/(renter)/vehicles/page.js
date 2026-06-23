"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import VehicleCard from "@/components/VehicleCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Search, SlidersHorizontal, X } from "lucide-react";
import toast from "react-hot-toast";

const TYPES = ["all", "car", "bike", "scooter"];

export default function VehiclesPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [vehicles, setVehicles] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        type: searchParams.get("type") || "",
        city: searchParams.get("city") || "",
        minPrice: "",
        maxPrice: "",
        page: 1,
    });

    const fetchVehicles = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.type) params.set("type", filters.type);
            if (filters.city) params.set("city", filters.city);
            if (filters.minPrice) params.set("minPrice", filters.minPrice);
            if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
            params.set("page", filters.page);
            params.set("limit", 12);

            const res = await api.get(`/vehicles?${params.toString()}`);
            setVehicles(res.data.data.vehicles);
            setPagination(res.data.data.pagination);
        } catch {
            toast.error("Failed to load vehicles");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const resetFilters = () => {
        setFilters({ type: "", city: "", minPrice: "", maxPrice: "", page: 1 });
    };

    const hasFilters = filters.type || filters.city || filters.minPrice || filters.maxPrice;

    return (
        <ProtectedRoute roles={["renter", "admin"]}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Browse Vehicles</h1>
                        <p className="text-text-secondary mt-1">
                            {pagination.total || 0} vehicles available
                        </p>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 btn-outline text-sm ${
                            showFilters ? "border-primary text-primary" : ""
                        }`}
                    >
                        <SlidersHorizontal size={16} />
                        Filters
                        {hasFilters && (
                            <span className="bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                                !
                            </span>
                        )}
                    </button>
                </div>

                {/* Type Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                    {TYPES.map((t) => (
                        <button
                            key={t}
                            onClick={() =>
                                setFilters((f) => ({
                                    ...f,
                                    type: t === "all" ? "" : t,
                                    page: 1,
                                }))
                            }
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                (t === "all" && !filters.type) || filters.type === t
                                    ? "bg-primary text-white"
                                    : "bg-card border border-border text-text-secondary hover:border-primary"
                            }`}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="card mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">City</label>
                            <input
                                className="input-field"
                                placeholder="e.g. Mumbai"
                                value={filters.city}
                                onChange={(e) =>
                                    setFilters((f) => ({ ...f, city: e.target.value, page: 1 }))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                Min Price (₹/day)
                            </label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="0"
                                value={filters.minPrice}
                                onChange={(e) =>
                                    setFilters((f) => ({ ...f, minPrice: e.target.value, page: 1 }))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                Max Price (₹/day)
                            </label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="10000"
                                value={filters.maxPrice}
                                onChange={(e) =>
                                    setFilters((f) => ({ ...f, maxPrice: e.target.value, page: 1 }))
                                }
                            />
                        </div>
                        {hasFilters && (
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-1.5 text-danger text-sm hover:underline"
                            >
                                <X size={14} />
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="card p-0 h-72 animate-pulse bg-card"
                            />
                        ))}
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="text-center py-24">
                        <Search size={48} className="text-border mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No vehicles found</h3>
                        <p className="text-text-secondary">
                            Try adjusting your filters
                        </p>
                        {hasFilters && (
                            <button
                                onClick={resetFilters}
                                className="btn-primary mt-4"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {vehicles.map((v) => (
                            <VehicleCard key={v._id} vehicle={v} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                        <button
                            disabled={filters.page === 1}
                            onClick={() =>
                                setFilters((f) => ({ ...f, page: f.page - 1 }))
                            }
                            className="btn-outline text-sm disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="flex items-center px-4 text-text-secondary text-sm">
                            {filters.page} / {pagination.totalPages}
                        </span>
                        <button
                            disabled={filters.page === pagination.totalPages}
                            onClick={() =>
                                setFilters((f) => ({ ...f, page: f.page + 1 }))
                            }
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