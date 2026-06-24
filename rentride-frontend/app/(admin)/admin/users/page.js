"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import { formatDate } from "@/lib/utils";
import { Search, ToggleLeft, ToggleRight, Loader2, Users } from "lucide-react";
import toast from "react-hot-toast";

const ROLES = ["all", "renter", "owner", "admin"];

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    const [page, setPage] = useState(1);
    const [togglingId, setTogglingId] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (role !== "all") params.set("role", role);
            params.set("page", page);
            params.set("limit", 15);
            const res = await api.get(`/admin/users?${params.toString()}`);
            setUsers(res.data.data.users);
            setPagination(res.data.data.pagination);
        } catch {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    }, [search, role, page]);

    useEffect(() => {
        const timeout = setTimeout(fetchUsers, 400);
        return () => clearTimeout(timeout);
    }, [fetchUsers]);

    const handleToggle = async (userId) => {
        setTogglingId(userId);
        try {
            const res = await api.patch(`/admin/users/${userId}/toggle`);
            setUsers(prev =>
                prev.map(u =>
                    u._id === userId ? { ...u, isActive: res.data.data.isActive } : u
                )
            );
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to toggle user");
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <ProtectedRoute roles={["admin"]}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="text-text-secondary mt-1">{pagination.total || 0} total users</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            className="input-field pl-9"
                            placeholder="Search by name, email or username..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="flex gap-2">
                        {ROLES.map(r => (
                            <button
                                key={r}
                                onClick={() => { setRole(r); setPage(1); }}
                                className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                                    role === r
                                        ? "bg-primary text-white"
                                        : "bg-card border border-border text-text-secondary hover:border-primary"
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="animate-spin text-primary" size={36} />
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-24">
                        <Users size={48} className="text-border mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No users found</h3>
                    </div>
                ) : (
                    <div className="card p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">User</th>
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Role</th>
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Joined</th>
                                        <th className="text-left px-4 py-3 text-text-secondary text-sm font-medium">Status</th>
                                        <th className="text-right px-4 py-3 text-text-secondary text-sm font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{u.fullname}</p>
                                                <p className="text-text-secondary text-xs">{u.email}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full border capitalize ${
                                                    u.role === "admin"
                                                        ? "bg-primary/10 text-primary border-primary/20"
                                                        : u.role === "owner"
                                                        ? "bg-info/10 text-info border-info/20"
                                                        : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-text-secondary text-sm">
                                                {formatDate(u.createdAt)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
                                                    u.isActive
                                                        ? "bg-success/10 text-success border-success/20"
                                                        : "bg-danger/10 text-danger border-danger/20"
                                                }`}>
                                                    {u.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => handleToggle(u._id)}
                                                    disabled={togglingId === u._id || u.role === "admin"}
                                                    className="disabled:opacity-40 disabled:cursor-not-allowed"
                                                    title={u.role === "admin" ? "Cannot deactivate admin" : "Toggle status"}
                                                >
                                                    {togglingId === u._id ? (
                                                        <Loader2 size={20} className="animate-spin text-text-secondary" />
                                                    ) : u.isActive ? (
                                                        <ToggleRight size={24} className="text-success hover:text-danger transition-colors" />
                                                    ) : (
                                                        <ToggleLeft size={24} className="text-danger hover:text-success transition-colors" />
                                                    )}
                                                </button>
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