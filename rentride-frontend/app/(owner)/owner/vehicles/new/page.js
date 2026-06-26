"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OwnerNewVehicleRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/admin/vehicles/new");
    }, [router]);
    return null;
}
