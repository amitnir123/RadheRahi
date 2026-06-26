"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import DatePicker from "@/components/DatePicker";
import { formatCurrency, calcDays } from "@/lib/utils";
import { PICKUP_PLACES, PLATFORM_CONTACT } from "@/lib/constants";
import {
    MapPin, Car, Bike, Zap, User,
    Phone, Mail, ChevronLeft, ChevronRight, Loader2, MapPinned
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
    const [booking, setBooking] = useState({
        startDate: "",
        endDate: "",
        pickupPlace: "",
    });
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
    }, [id, router]);

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
        if (!booking.pickupPlace) {
            toast.error("Select a pickup place");
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
                pickupPlace: booking.pickupPlace,
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
    const contactPhone = vehicle.listedBy?.phone || PLATFORM_CONTACT.phone;
    const contactEmail = vehicle.listedBy?.email || PLATFORM_CONTACT.email;

    return (
        <ProtectedRoute roles={["renter", "admin"]}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link
                    href="/vehicles"
                    className="flex items-center gap-1.5 text-text-secondary hover:text-white transition-colors mb-6 text-sm"
                >
                    <ChevronLeft size={16} /> Back to vehicles
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
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
                                                alt=""
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="card space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold">{vehicle.name}</h1>
                                    <p className="text-text-secondary mt-1">
                                        {vehicle.brand} {vehicle.model} · {vehicle.year}
                                    </p>
                                    {vehicle.vehicleNo && (
                                        <p className="text-text-secondary text-sm mt-1">
                                            Reg. No: {vehicle.vehicleNo}
                                        </p>
                                    )}
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

                        {vehicle.ownerName && (
                            <div className="card">
                                <h2 className="font-bold text-lg mb-4">Vehicle Owner</h2>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{vehicle.ownerName}</p>
                                        <p className="text-text-secondary text-sm">
                                            Contact via RentRide
                                        </p>
                                        <div className="flex flex-col gap-1 mt-2 text-sm text-text-secondary">
                                            <span className="flex items-center gap-1.5">
                                                <Phone size={13} className="text-primary" />
                                                {contactPhone}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Mail size={13} className="text-primary" />
                                                {contactEmail}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="card sticky top-24">
                            <div className="mb-4">
                                <span className="text-3xl font-bold text-primary">
                                    {formatCurrency(vehicle.pricePerDay)}
                                </span>
                                <span className="text-text-secondary"> /day</span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <DatePicker
                                    label="Start Date"
                                    value={booking.startDate}
                                    min={today}
                                    onChange={(startDate) =>
                                        setBooking((b) => ({
                                            ...b,
                                            startDate,
                                            endDate:
                                                b.endDate && b.endDate <= startDate
                                                    ? ""
                                                    : b.endDate,
                                        }))
                                    }
                                />
                                <DatePicker
                                    label="End Date"
                                    value={booking.endDate}
                                    min={booking.startDate || today}
                                    disabled={!booking.startDate}
                                    onChange={(endDate) =>
                                        setBooking((b) => ({ ...b, endDate }))
                                    }
                                />
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                                        <MapPinned size={14} className="text-primary" />
                                        Pickup Place
                                    </label>
                                    <select
                                        className="input-field"
                                        value={booking.pickupPlace}
                                        onChange={(e) =>
                                            setBooking((b) => ({
                                                ...b,
                                                pickupPlace: e.target.value,
                                            }))
                                        }
                                    >
                                        <option value="">Select pickup location</option>
                                        {PICKUP_PLACES.map((place) => (
                                            <option key={place} value={place}>
                                                {place}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

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
                                    disabled={booking_loading || days < 1 || !booking.pickupPlace}
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
                                No charge until admin accepts
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
