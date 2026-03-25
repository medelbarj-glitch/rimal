'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function SocialButton() {
    const [phoneNumber, setPhoneNumber] = useState('+212600000000');
    
    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data && data.phoneNumber) {
                    setPhoneNumber(data.phoneNumber);
                }
            })
            .catch(err => console.error('Error fetching settings:', err));
    }, []);

    // Clean phone number for WhatsApp link (remove spaces, etc.)
    const cleanPhoneNumber = phoneNumber.replace(/[^0-9+]/g, '');
    const message = encodeURIComponent("Bonjour, je suis intéressé par la location d'une voiture.");

    const pathname = usePathname();

    // Si le chemin commence par /admin, on ne retourne rien (on cache le bouton)
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <div className="social-float">
            <a
                href="https://www.instagram.com/rimal"
                className="instagram-float"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contacter sur Instagram"
            >
                <i className="fab fa-instagram"></i>
            </a>
            <a
                href={`https://wa.me/${cleanPhoneNumber}?text=${message}`}
                className="whatsapp-float"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contacter sur WhatsApp"
            >
                <i className="fab fa-whatsapp"></i>
            </a>
        </div>
    );
}
