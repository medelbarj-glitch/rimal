"use client";

import React from 'react';
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) return null;

    return (
        <div className="footer">
            <div className="first-cat">
                <span>Bouderba Rental Cars</span>
                <a href="#">Réservations</a>
                <a href="#">Nos Véhicules</a>
                <a href="#">Nos Localisations</a>
                <a href="#">Notre Agence</a>
                <a href="#">Nous Contacter</a>
            </div>
            <div className="second-cat">
                <a href="#">Conditions Générales de Location</a>
                <a href="#">Politique de Confidentialité</a>
                <a href="#">Mentions Légales</a>
                <a href="#">Plan du Site</a>
            </div>
            <div className="third-cat">
                <a href="#"><i className="fab fa-whatsapp"></i>What's app</a>
                <a href="#"><i className="fab fa-instagram"></i>Instagram</a>
            </div>
            <span>© 2025 Bouderba Rental Cars. Tous droits réservés.</span>
        </div>
    );
}
