"use client";

import { usePathname } from "next/navigation";
import { NavbarAndMenu } from "./Menu";
// Ajoute "Location" dans l'import ci-dessous 
import type { ModeleVoiture, Location } from "@prisma/client"; 

interface NavbarWrapperProps {
    voitures: ModeleVoiture[];
    locations: Location[];
    logoUrl?: string;
}

export default function NavbarWrapper({ voitures, locations, logoUrl }: NavbarWrapperProps) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    if (isAdmin) return null;

    // Ajoute locations ici pour satisfaire TypeScript
    return <NavbarAndMenu voitures={voitures} locations={locations} logoUrl={logoUrl} />;
}