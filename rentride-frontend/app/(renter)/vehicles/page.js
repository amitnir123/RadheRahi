"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import VehicleCard from "@/components/VehicleCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Search, SlidersHorizontal, X, ChevronDown, Loader2, Filter } from "lucide-react";
import toast from "react-hot-toast";

const TYPES = ["all", "car", "bike", "scooter"];
const SORT_OPTIONS = [
    { value: "newest", label: "Newest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
];

export default function VehiclesPage() {
    return (
        <Suspense fallback={<VehiclesSkeleton />}>
            <VehiclesContent />
        </Suspense>
    );
}

function VehiclesSkeleton() {
    return (
        <ProtectedRoute roles={["renter", "admin"]}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="card p-0 h-72 animate-pulse bg-card" />
                    ))}
                </div>
            </div>
        </ProtectedRoute>
    );
}

function VehiclesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [vehicles, setVehicles] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
    const [viewMode, setViewMode] = useState("grid");

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
            params.set("limit", viewMode === "list" ? 10 : 12);
            params.set("sort", sortBy);

            const res = await api.get(`/vehicles?${params.toString()}`);
            setVehicles(res.data.data.vehicles);
            setPagination(res.data.data.pagination);
        } catch {
            toast.error("Failed to load vehicles");
        } finally {
            setLoading(false);
        }
    }, [filters, sortBy, viewMode]);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const resetFilters = () => {
        setFilters({ type: "", city: "", minPrice: "", maxPrice: "", page: 1 });
        setSortBy("newest");
    };

    const hasFilters = filters.type || filters.city || filters.minPrice || filters.maxPrice;

    const updateUrl = () => {
        const params = new URLSearchParams();
        if (filters.type) params.set("type", filters.type);
        if (filters.city) params.set("city", filters.city);
        if (filters.minPrice) params.set("minPrice", filters.minPrice);
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
        if (sortBy !== "newest") params.set("sort", sortBy);
        params.set("page", filters.page);
        router.push(`/vehicles?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        updateUrl();
    }, [filters, sortBy, router]);

    return (
        <ProtectedRoute roles={["renter", "admin"]}>
            <div className="container-page py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Browse Vehicles</h1>
                        <p className="text-text-secondary mt-1">
                            {pagination.total || 0} vehicles available
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center justify-center gap-2 btn-outline text-sm ${
                                showFilters ? "border-primary text-primary" : ""
                            }`}
                        >
                            <Filter size={16} />
                            Filters
                            {hasFilters && (
                                <span className="bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    !
                                </span>
                            )}
                        </button>
                        <div className="flex items-center gap-2">
                            <label htmlFor="sort" className="text-text-secondary text-sm hidden sm:block">
                                Sort by:
                            </label>
                            <select
                                id="sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="input-field py-2 pl-3 pr-10 appearance-none bg-white cursor-pointer"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded transition-colors ${
                                    viewMode === "grid"
                                        ? "bg-primary text-white"
                                        : "text-text-secondary hover:text-foreground"
                                }`}
                                aria-label="Grid view"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded transition-colors ${
                                    viewMode === "list"
                                        ? "bg-primary text-white"
                                        : "text-text-secondary hover:text-foreground"
                                }`}
                                aria-label="List view"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Type Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
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
                    <div className="card mb-6 p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-300">
                        <div>
                            <label className="label" htmlFor="city">City</label>
                            <input
                                id="city"
                                className="input-field"
                                placeholder="e.g. Mathura"
                                value={filters.city}
                                onChange={(e) =>
                                    setFilters((f) => ({ ...f, city: e.target.value, page: 1 }))
                                }
                            />
                        </div>
                        <div>
                            <label className="label" htmlFor="minPrice">Min Price (₹/day)</label>
                            <input
                                id="minPrice"
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
                            <label className="label" htmlFor="maxPrice">Max Price (₹/day)</label>
                            <input
                                id="maxPrice"
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
                                className="flex items-center justify-center gap-1.5 text-danger text-sm hover:underline self-end"
                            >
                                <X size={14} />
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

                {/* Grid/List */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(viewMode === "list" ? 5 : 8)].map((_, i) => (
                            <div key={i} className="card p-0 h-72 animate-pulse bg-card" />
                        ))}
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="text-center py-24">
                        <Search size={48} className="text-border mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No vehicles found</h3>
                        <p className="text-text-secondary mb-4">
                            Try adjusting your filters or search criteria
                        </p>
                        {hasFilters && (
                            <button
                                onClick={resetFilters}
                                className="btn-primary"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={`space-y-4 ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : ""}`}>
                        {vehicles.map((v) => (
                            <VehicleCard
                                key={v._id}
                                vehicle={v}
                                variant={viewMode === "list" ? "compact" : "default"}
                            />
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