"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function OwnerEditVehicleRedirect() {
    const router = useRouter();
    const { id } = useParams();
    useEffect(() => {
        router.replace(`/admin/vehicles/${id}/edit`);
    }, [router, id]);
    return null;
}
