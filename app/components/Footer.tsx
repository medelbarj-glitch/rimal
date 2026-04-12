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

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        if (window.location.pathname === '/') {
            const element = document.getElementById(targetId);
            if (element) {
                e.preventDefault();
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    if (isAdmin) return null;

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="first-cat">
                    <span>Bouderba Rental Cars</span>
                    <a href="/#reservations" onClick={(e) => handleSmoothScroll(e, 'reservations')}>Réservations</a>
                    <a href="/#vehicules" onClick={(e) => handleSmoothScroll(e, 'vehicules')}>Nos Véhicules</a>
                    <a href="/#localisations" onClick={(e) => handleSmoothScroll(e, 'localisations')}>Nos Localisations</a>
                    <a href="/#agence" onClick={(e) => handleSmoothScroll(e, 'agence')}>Notre Agence</a>
                    <a href="/#contact" onClick={(e) => handleSmoothScroll(e, 'contact')}>Nous Contacter</a>
                </div>
                <div className="second-cat">
                    <a href="/legal#conditions">Conditions Générales de Location</a>
                    <a href="/legal#confidentialite">Politique de Confidentialité</a>
                    <a href="/legal#mentions">Mentions Légales</a>
                </div>
                <div className="third-cat">
                    <a href={`https://wa.me/${cleanPhoneNumber}?text=${message}`} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-whatsapp"></i>WhatsApp
                    </a>
                    <a href="https://www.instagram.com/bouderba.rental.cars" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram"></i>Instagram
                    </a>
                </div>
            </div>
            <div className="footer-bottom">
                <span>© 2026 Bouderba Rental Cars. Tous droits réservés.</span>
            </div>
        </footer>
    );
}
