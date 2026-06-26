"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import { formatCurrency } from "@/lib/utils";
import {
    Activity, Users, CalendarCheck, Car, IndianRupee,
    Loader2, Radio, RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminMonitorPage() {
    const [data, setData] = useState(null);
    const [connected, setConnected] = useState(false);
    const [migrating, setMigrating] = useState(false);

    const fetchMonitor = useCallback(async () => {
        try {
            const res = await api.get("/admin/monitor");
            setData(res.data.data);
            setConnected(true);
        } catch {
            setConnected(false);
        }
    }, []);

    useEffect(() => {
        fetchMonitor();
        const interval = setInterval(fetchMonitor, 5000);
        return () => clearInterval(interval);
    }, [fetchMonitor]);

    const handleMigrate = async () => {
        setMigrating(true);
        try {
            const res = await api.post("/admin/users/migrate-legacy");
            toast.success(res.data.message);
            fetchMonitor();
        } catch (err) {
            toast.error(err.response?.data?.message || "Migration failed");
        } finally {
            setMigrating(false);
        }
    };

    const stats = data?.stats;
    const activity = data?.activity || [];

    const statCards = [
        { label: "Active Users", value: stats?.activeUsers ?? "—", icon: Users, color: "text-primary" },
        { label: "Pending Bookings", value: stats?.pendingBookings ?? "—", icon: CalendarCheck, color: "text-warning" },
        { label: "Pending Vehicles", value: stats?.pendingVehicles ?? "—", icon: Car, color: "text-info" },
        { label: "Active Bookings", value: stats?.activeBookings ?? "—", icon: Activity, color: "text-success" },
        { label: "Revenue", value: stats ? formatCurrency(stats.totalRevenue) : "—", icon: IndianRupee, color: "text-primary" },
    ];

    return (
        <ProtectedRoute roles={["admin"]}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Live Monitoring</h1>
                        <p className="text-text-secondary mt-1 flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border ${
                                connected
                                    ? "bg-success/10 text-success border-success/20"
                                    : "bg-danger/10 text-danger border-danger/20"
                            }`}>
                                <Radio size={10} className={connected ? "animate-pulse" : ""} />
                                {connected ? "Live" : "Disconnected"}
                            </span>
                            Auto-refreshes every 5 seconds
                        </p>
                    </div>
                    <button
                        onClick={handleMigrate}
                        disabled={migrating}
                        className="btn-outline text-sm flex items-center gap-2"
                    >
                        {migrating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                        Migrate Legacy Owners
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                    {statCards.map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="card">
                            <Icon size={20} className={`${color} mb-2`} />
                            <p className="text-2xl font-bold">{value}</p>
                            <p className="text-text-secondary text-sm">{label}</p>
                        </div>
                    ))}
                </div>

                <div className="card">
                    <h2 className="font-bold text-lg mb-4">Recent Activity</h2>
                    {!data ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-primary" size={28} />
                        </div>
                    ) : activity.length === 0 ? (
                        <p className="text-text-secondary text-sm">No recent activity yet.</p>
                    ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {activity.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 py-2 border-b border-border last:border-0"
                                >
                                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                        item.type === "booking" ? "bg-warning" :
                                        item.type === "login" ? "bg-info" :
                                        item.type === "register" ? "bg-success" : "bg-primary"
                                    }`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm">{item.message}</p>
                                        <p className="text-text-secondary text-xs mt-0.5">
                                            {new Date(item.timestamp).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                    <span className="text-xs text-text-secondary capitalize bg-border px-2 py-0.5 rounded-full">
                                        {item.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
