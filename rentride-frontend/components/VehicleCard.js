"use client";
import Link from "next/link";
import { MapPin, Star, Car, Bike, Zap } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

const TYPE_ICON = {
    car: Car,
    bike: Bike,
    scooter: Zap,
};

export default function VehicleCard({ vehicle, showStatus = false }) {
    const Icon = TYPE_ICON[vehicle.type] || Car;

    return (
        <Link href={`/vehicles/${vehicle._id}`}>
            <div className="card p-0 overflow-hidden hover:border-primary transition-colors group cursor-pointer h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 bg-border overflow-hidden">
                    {vehicle.images?.[0]?.url ? (
                        <img
                            src={vehicle.images[0].url}
                            alt={vehicle.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Icon size={48} className="text-border" />
                        </div>
                    )}
                    {/* Type badge */}
                    <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 capitalize">
                        <Icon size={12} className="text-primary" />
                        {vehicle.type}
                    </div>
                    {showStatus && (
                        <div className="absolute top-3 right-3">
                            <StatusBadge status={vehicle.status} />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-white text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                        {vehicle.name}
                    </h3>
                    <p className="text-text-secondary text-sm mb-3">
                        {vehicle.brand} {vehicle.model} · {vehicle.year}
                    </p>

                    <div className="flex items-center gap-1 text-text-secondary text-sm mb-4">
                        <MapPin size={14} className="text-primary flex-shrink-0" />
                        {vehicle.location?.city}, {vehicle.location?.state}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                        <div>
                            <span className="text-2xl font-bold text-primary">
                                {formatCurrency(vehicle.pricePerDay)}
                            </span>
                            <span className="text-text-secondary text-sm"> /day</span>
                        </div>
                        {vehicle.owner?.fullname && (
                            <span className="text-text-secondary text-xs">
                                by {vehicle.owner.fullname}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}