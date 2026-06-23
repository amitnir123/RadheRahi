"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import { formatCurrency, formatDate, calcDays } from "@/lib/utils";
import {
    MapPin, Car, Bike, Zap, Calendar, User,
    Phone, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import Link from "next/link";

const TYPE_ICON = { car: Car, bike: Bike, scooter: Zap };

export default function VehicleDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuthStore();

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [booking, setBooking] = useState({ startDate: "", endDate: "" });
    const [booking_loading, setBookingLoading] = useState(false);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await api.get(`/vehicles/${id}`);
                setVehicle(res.data.data);
            } catch {
                toast.error("Vehicle not found");
                router.push("/vehicles");
            } finally {
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [id]);

    const today = new Date().toISOString().split("T")[0];
    const days =
        booking.startDate && booking.endDate
            ? calcDays(booking.startDate, booking.endDate)
            : 0;
    const totalPrice = days > 0 && vehicle ? days * vehicle.pricePerDay : 0;

    const handleBook = async () => {
        if (!booking.startDate || !booking.endDate) {
            toast.error("Select start and end date");
            return;
        }
        if (days < 1) {
            toast.error("End date must be after start date");
            return;
        }
        setBookingLoading(true);
        try {
            const res = await api.post("/bookings", {
                vehicleId: id,
                startDate: booking.startDate,
                endDate: booking.endDate,
            });
            toast.success("Booking request sent!");
            router.push(`/bookings/${res.data.data._id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || "Booking failed");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={36} />
            </div>
        );
    }

    if (!vehicle) return null;

    const Icon = TYPE_ICON[vehicle.type] || Car;

    return (
        <ProtectedRoute roles={["renter", "admin"]}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back */}
                <Link
                    href="/vehicles"
                    className="flex items-center gap-1.5 text-text-secondary hover:text-white transition-colors mb-6 text-sm"
                >
                    <ChevronLeft size={16} /> Back to vehicles
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left — Images + Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="card p-0 overflow-hidden">
                            <div className="relative h-80 bg-border">
                                {vehicle.images?.length > 0 ? (
                                    <img
                                        src={vehicle.images[activeImg]?.url}
                                        alt={vehicle.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Icon size={64} className="text-border" />
                                    </div>
                                )}
                                {vehicle.images?.length > 1 && (
                                    <>
                                        <button
                                            onClick={() =>
                                                setActiveImg((i) =>
                                                    i === 0 ? vehicle.images.length - 1 : i - 1
                                                )
                                            }
                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 p-2 rounded-full hover:bg-background"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveImg((i) =>
                                                    i === vehicle.images.length - 1 ? 0 : i + 1
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 p-2 rounded-full hover:bg-background"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </>
                                )}
                            </div>
                            {/* Thumbnails */}
                            {vehicle.images?.length > 1 && (
                                <div className="flex gap-2 p-3 overflow-x-auto">
                                    {vehicle.images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImg(i)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                                activeImg === i
                                                    ? "border-primary"
                                                    : "border-border"
                                            }`}
                                        >
                                            <img
                                                src={img.url}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Vehicle Info */}
                        <div className="card space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold">{vehicle.name}</h1>
                                    <p className="text-text-secondary mt-1">
                                        {vehicle.brand} {vehicle.model} · {vehicle.year}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-sm capitalize">
                                    <Icon size={14} />
                                    {vehicle.type}
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-text-secondary">
                                <MapPin size={16} className="text-primary" />
                                {vehicle.location?.city}, {vehicle.location?.state}
                            </div>

                            {vehicle.description && (
                                <p className="text-text-secondary leading-relaxed">
                                    {vehicle.description}
                                </p>
                            )}
                        </div>

                        {/* Owner Info */}
                        {vehicle.owner && (
                            <div className="card">
                                <h2 className="font-bold text-lg mb-4">Vehicle Owner</h2>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{vehicle.owner.fullname}</p>
                                        <p className="text-text-secondary text-sm">
                                            @{vehicle.owner.username}
                                        </p>
                                    </div>
                                    {vehicle.owner.phone && (
                                        <div className="ml-auto flex items-center gap-1.5 text-text-secondary text-sm">
                                            <Phone size={14} className="text-primary" />
                                            {vehicle.owner.phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right — Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-24">
                            <div className="mb-4">
                                <span className="text-3xl font-bold text-primary">
                                    {formatCurrency(vehicle.pricePerDay)}
                                </span>
                                <span className="text-text-secondary"> /day</span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                                        <Calendar size={14} className="text-primary" />
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        min={today}
                                        value={booking.startDate}
                                        onChange={(e) =>
                                            setBooking((b) => ({
                                                ...b,
                                                startDate: e.target.value,
                                                endDate: "",
                                            }))
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                                        <Calendar size={14} className="text-primary" />
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        min={booking.startDate || today}
                                        value={booking.endDate}
                                        onChange={(e) =>
                                            setBooking((b) => ({
                                                ...b,
                                                endDate: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            {days > 0 && (
                                <div className="bg-background rounded-lg p-3 mb-4 space-y-2 text-sm">
                                    <div className="flex justify-between text-text-secondary">
                                        <span>
                                            {formatCurrency(vehicle.pricePerDay)} × {days} days
                                        </span>
                                        <span>{formatCurrency(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-white border-t border-border pt-2">
                                        <span>Total</span>
                                        <span className="text-primary">
                                            {formatCurrency(totalPrice)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {user?.role === "renter" ? (
                                <button
                                    onClick={handleBook}
                                    disabled={booking_loading || days < 1}
                                    className="btn-primary w-full"
                                >
                                    {booking_loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 size={16} className="animate-spin" />
                                            Sending Request...
                                        </span>
                                    ) : (
                                        "Book Now"
                                    )}
                                </button>
                            ) : (
                                <div className="text-center text-text-secondary text-sm py-2">
                                    Only renters can book vehicles
                                </div>
                            )}

                            <p className="text-center text-text-secondary text-xs mt-3">
                                No charge until owner accepts
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}