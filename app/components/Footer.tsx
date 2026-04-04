"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { getSettings } from '@/app/actions/settingsActions';

export function Footer() {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    const [phoneNumber, setPhoneNumber] = useState('+212667332834');

    useEffect(() => {
        getSettings()
            .then(data => {
                if (data && data.phoneNumber) {
                    setPhoneNumber(data.phoneNumber);
                }
            })
            .catch(err => console.error('Error fetching settings:', err));
    }, []);

    const cleanPhoneNumber = phoneNumber.replace(/[^0-9+]/g, '');
    const message = encodeURIComponent("Bonjour, je suis intéressé par la location d'une voiture.");

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
                <a href={`https://wa.me/${cleanPhoneNumber}?text=${message}`} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-whatsapp"></i>What's app
                </a>
                <a href="https://www.instagram.com/bouderba.rental.cars"><i className="fab fa-instagram"></i>Instagram</a>
            </div>
            <span>© 2026 Bouderba Rental Cars. Tous droits réservés.</span>
        </div>
    );
}
