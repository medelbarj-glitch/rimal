"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { getSettings } from '@/app/actions/settingsActions';
import { useTranslations } from "next-intl";

export function Footer() {
    const t = useTranslations("footer");
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
                    <a href="/#reservations" onClick={(e) => handleSmoothScroll(e, 'reservations')}>{t('reservations')}</a>
                    <a href="/#vehicules" onClick={(e) => handleSmoothScroll(e, 'vehicules')}>{t('vehicles')}</a>
                    <a href="/locations">{t('locations')}</a>
                    <a href="/agency" onClick={(e) => handleSmoothScroll(e, 'agence')}>{t('agency')}</a>
                    <a href="/agency#contact" onClick={(e) => handleSmoothScroll(e, 'contact')}>{t('contact')}</a>
                </div>
                <div className="second-cat">
                    <a href="/legal#conditions">{t('terms')}</a>
                    <a href="/legal#confidentialite">{t('privacy')}</a>
                    <a href="/legal#mentions">{t('legal')}</a>
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
                <span>© {new Date().getFullYear()} Bouderba Rental Cars. {t('rights')}</span>
            </div>
        </footer>
    );
}
