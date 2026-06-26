"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OwnerVehiclesRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/admin/vehicles/manage");
    }, [router]);
    return null;
}
