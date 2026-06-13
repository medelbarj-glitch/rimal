"use client";
import { usePathname } from "next/navigation";
import { NavbarAndMenu } from "./Menu";
import CurrencyToggle from "./CurrencyToggle";
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
  return (
    <div style={{ position: 'relative' }}>
      <NavbarAndMenu voitures={voitures} locations={locations} logoUrl={logoUrl} />
      <div style={{ position: 'fixed', top: '0.75rem', right: '9rem', zIndex: 1000 }}>
        <CurrencyToggle />
      </div>
    </div>
  );
}
