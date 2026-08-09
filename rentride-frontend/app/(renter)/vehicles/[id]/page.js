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
    Phone, Mail, ChevronLeft, ChevronRight, Loader2, MapPinned,
    Share2, Heart, ShieldCheck, Star, Calendar, Fuel, Settings, Users,
    X, Check, AlertCircle, CreditCard
} from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";

const TYPE_ICON = { car: Car, bike: Bike, scooter: Zap };

const AMENITIES = [
    { key: "ac", icon: "❄️", label: "Air Conditioning" },
    { key: "music", icon: "🎵", label: "Music System" },
    { key: "charging", icon: "🔌", label: "Phone Charging" },
    { key: "gps", icon: "📍", label: "GPS Navigation" },
    { key: "helmet", icon: "🪖", label: "Helmet Included" },
    { key: "insurance", icon: "🛡️", label: "Insurance Covered" },
];

export default function VehicleDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuthStore();

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);
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

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: vehicle.name,
                    text: `Check out this ${vehicle.type} on RentRide: ${vehicle.name}`,
                    url: window.location.href,
                });
            } catch (err) {
                if (err.name !== "AbortError") toast.error("Failed to share");
            }
        } else {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
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
    const rating = vehicle.rating || 4.8;
    const reviewCount = vehicle.reviewCount || 0;

    return (
        <ProtectedRoute roles={["renter", "admin"]}>
            <div className="container-page py-8">
                <Link
                    href="/vehicles"
                    className="flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors mb-6 text-sm"
                >
                    <ChevronLeft size={16} /> Back to vehicles
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="card p-0 overflow-hidden">
                            <div className="relative h-80 md:h-96 bg-border">
                                {vehicle.images?.length > 0 ? (
                                    <img
                                        src={vehicle.images[activeImg]?.url}
                                        alt={vehicle.name}
                                        className="w-full h-full object-cover cursor-zoom-in"
                                        onClick={() => setShowLightbox(true)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Icon size={80} className="text-border" />
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
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur p-2 rounded-full text-foreground hover:bg-white shadow-lg transition-colors"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveImg((i) =>
                                                    i === vehicle.images.length - 1 ? 0 : i + 1
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur p-2 rounded-full text-foreground hover:bg-white shadow-lg transition-colors"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}
                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1.5 rounded-full shadow-sm capitalize">
                                        <Icon size={14} className="text-primary" />
                                        {vehicle.type}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1.5 rounded-full shadow-sm">
                                        <ShieldCheck size={12} className="text-success" />
                                        Verified
                                    </div>
                                </div>
                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                    <button
                                        onClick={handleShare}
                                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                                        aria-label="Share vehicle"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                    <button
                                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                                        aria-label="Add to favorites"
                                    >
                                        <Heart size={18} className="text-text-secondary" />
                                    </button>
                                </div>
                            </div>
                            {vehicle.images?.length > 1 && (
                                <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
                                    {vehicle.images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImg(i)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                activeImg === i
                                                    ? "border-primary"
                                                    : "border-transparent hover:border-border"
                                            }`}
                                            aria-label={`View image ${i + 1}`}
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

                            {/* Lightbox Modal */}
                            {showLightbox && (
                                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={() => setShowLightbox(false)}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowLightbox(false); }}
                                        className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                        aria-label="Close lightbox"
                                    >
                                        <X size={24} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActiveImg((i) => i === 0 ? vehicle.images.length - 1 : i - 1); }}
                                        className="absolute left-4 w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={28} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActiveImg((i) => i === vehicle.images.length - 1 ? 0 : i + 1); }}
                                        className="absolute right-4 w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight size={28} />
                                    </button>
                                    <img
                                        src={vehicle.images[activeImg]?.url}
                                        alt={vehicle.name}
                                        className="max-h-[90vh] max-w-[90vw] object-contain"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Vehicle Info */}
                        <div className="card space-y-5 p-6">
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

                            <div className="flex items-center gap-4 text-text-secondary flex-wrap">
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={16} className="text-primary" />
                                    {vehicle.location?.city}, {vehicle.location?.state}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Star size={16} className="text-warning fill-warning" />
                                    <span className="font-medium">{rating}</span>
                                    <span className="text-text-secondary">({reviewCount} reviews)</span>
                                </span>
                                {vehicle.transmission && (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-sm">
                                        <Settings size={14} className="text-primary" />
                                        {vehicle.transmission}
                                    </span>
                                )}
                                {vehicle.fuelType && (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-sm">
                                        <Fuel size={14} className="text-primary" />
                                        {vehicle.fuelType}
                                    </span>
                                )}
                                {vehicle.seatingCapacity && (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-sm">
                                        <Users size={14} className="text-primary" />
                                        {vehicle.seatingCapacity} seats
                                    </span>
                                )}
                            </div>

                            {vehicle.description && (
                                <p className="text-text-secondary leading-relaxed border-t border-border pt-5">
                                    {vehicle.description}
                                </p>
                            )}

                            {/* Amenities */}
                            <div>
                                <h3 className="font-semibold mb-4">Features & Amenities</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {AMENITIES.map((a) => (
                                        <div key={a.key} className="flex items-center gap-2.5 text-sm text-text-secondary">
                                            <span className="text-lg">{a.icon}</span>
                                            <span>{a.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {vehicle.ownerName && (
                            <div className="card p-6">
                                <h2 className="font-bold text-lg mb-4">Vehicle Owner</h2>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User size={20} className="text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{vehicle.ownerName}</p>
                                        <p className="text-text-secondary text-sm">Contact via RentRide</p>
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

                    {/* Booking Panel */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-24 p-6 space-y-5">
                            <div className="mb-2">
                                <span className="text-3xl font-bold text-primary">
                                    {formatCurrency(vehicle.pricePerDay)}
                                </span>
                                <span className="text-text-secondary"> /day</span>
                            </div>

                            <div className="space-y-4">
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
                                    <label className="label" htmlFor="pickupPlace">
                                        <MapPinned size={14} className="text-primary" />
                                        Pickup Place
                                    </label>
                                    <select
                                        id="pickupPlace"
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
                                <div className="bg-background rounded-lg p-4 space-y-3 text-sm border border-border">
                                    <div className="flex justify-between text-text-secondary">
                                        <span>
                                            {formatCurrency(vehicle.pricePerDay)} × {days} days
                                        </span>
                                        <span>{formatCurrency(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-foreground border-t border-border pt-3">
                                        <span>Total</span>
                                        <span className="text-primary text-xl">
                                            {formatCurrency(totalPrice)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-secondary text-center">
                                        No charge until admin accepts
                                    </p>
                                </div>
                            )}

                            {user?.role === "renter" ? (
                                <button
                                    onClick={handleBook}
                                    disabled={booking_loading || days < 1 || !booking.pickupPlace}
                                    className="btn-primary w-full btn-lg"
                                >
                                    {booking_loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 size={18} className="animate-spin" />
                                            Sending Request...
                                        </span>
                                    ) : (
                                        "Book Now"
                                    )}
                                </button>
                            ) : (
                                <div className="text-center text-text-secondary text-sm py-2 border-t border-border pt-4">
                                    <Link href="/login" className="text-primary hover:underline font-medium">
                                        Sign in
                                    </Link>{" "}
                                    to book this vehicle
                                </div>
                            )}

                            <p className="text-center text-text-secondary text-xs">
                                Secure payment via Razorpay · Free cancellation
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
