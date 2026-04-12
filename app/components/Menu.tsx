// Fichier : app/components/NavbarAndMenu.tsx

"use client"; // Obligatoire pour les 'useState' et 'onClick'

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
// Importe le type de données que Prisma nous donne
import { ModeleVoiture, Location } from '@prisma/client';
import { getSettings } from '@/app/actions/settingsActions';
import { getTranslatedField } from '@/lib/translate';
import { useLocale } from 'next-intl';

// 1. Définir les "props" que ce composant reçoit
// Il a besoin de la liste des voitures (récupérée par le serveur)
interface NavbarProps {
  voitures: ModeleVoiture[];
  locations: Location[];
  isOtherPage?: boolean;
}

export function NavbarAndMenu({ voitures, locations, isOtherPage = false }: NavbarProps) {
  const tNav = useTranslations('navbar');
  const tMenu = useTranslations('menu');
  const locale = useLocale();

  // 2. Remplacer les querySelector par des états React
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('vehicules'); // 'vehicules' est l'onglet par défaut
  const [logoUrl, setLogoUrl] = useState<string>('/default-logo.png');

  // Récupération du logo depuis la DB au montage du composant
  useEffect(() => {
    async function loadLogo() {
      try {
        const settings = await getSettings();
        if (settings?.logoUrl) {
          setLogoUrl(settings.logoUrl);
        }
      } catch (error) {
        console.error("Erreur chargement logo:", error);
      }
    }
    loadLogo();
  }, []);

  // 3. Remplacer les addEventListener par des fonctions
  const openMenu = () => {
    setIsMenuOpen(true);
  };
  const closeMenu = () => setIsMenuOpen(false);

  const selectTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    if (isMenuOpen) {
      // Quand le menu s'ouvre, bloque le scroll du body
      document.body.classList.add('no-scroll');
    } else {
      // Quand le menu se ferme, ré-autorise le scroll
      document.body.classList.remove('no-scroll');
    }

    // Fonction de "nettoyage" :
    // S'assure de retirer la classe si le composant est détruit
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMenuOpen]); // On surveille la variable 'isMenuOpen'

  function toSentenceCase(str: string): string {
    if (!str) return ''; // Gère les cas où la chaîne est vide

    const firstLetter = str.charAt(0).toUpperCase();
    const rest = str.slice(1).toLowerCase();

    return firstLetter + rest;
  }

  const arrow_svg = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="18px" height="18px" viewBox="0 0 32 32" version="1.1">
        <path d="M8.489 31.975c-0.271 0-0.549-0.107-0.757-0.316-0.417-0.417-0.417-1.098 0-1.515l14.258-14.264-14.050-14.050c-0.417-0.417-0.417-1.098 0-1.515s1.098-0.417 1.515 0l14.807 14.807c0.417 0.417 0.417 1.098 0 1.515l-15.015 15.022c-0.208 0.208-0.486 0.316-0.757 0.316z" />
      </svg>
    )
  }

  return (
    <>
      {/* ================================================= */}
      {/* NAVBAR                                            */}
      {/* ================================================= */}
      <nav className={`navbar${isOtherPage ? ' navbar-reservation' : ''}`}>

        {/* Hamburger */}
        <div className="hamburger" onClick={openMenu} role="button" aria-label="Ouvrir le menu">
          <div className="hamburger-lines">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="hamburger-label">Menu</span>
        </div>

        {/* Logo centré */}
        <div className="logo">
          <a href="/">
            {logoUrl ? (
              <img src={logoUrl} alt="Bouderba Rental Cars Logo" />
            ) : (
              'Bouderba Rental Cars'
            )}
          </a>
        </div>

      </nav>

      {/* ================================================= */}
      {/* MENU OVERLAY                                      */}
      {/* ================================================= */}
      <div className={`menu${isMenuOpen ? ' active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closeMenu(); }}>
        <div className="menu-overlay">

          {/* LEFT PANEL — Navigation tabs */}
          <div className="menu-overlay-left" id="menu">
            <div className="items">

              <a
                href="#"
                className={activeTab === 'vehicules' ? 'selected' : ''}
                onClick={(e) => { e.preventDefault(); selectTab('vehicules'); }}
              >
                <span>{tNav('vehicles')}</span>
                {arrow_svg()}
              </a>

              <a
                href="#"
                className={activeTab === 'localisations' ? 'selected' : ''}
                onClick={(e) => { e.preventDefault(); selectTab('localisations'); }}
              >
                <span>{tNav('locations')}</span>
                {arrow_svg()}
              </a>

              <a href="/reservation">
                <span>{tNav('reservations')}</span>
                {arrow_svg()}
              </a>

              <a href="/agency">
                <span>{tNav('contact')}</span>
                {arrow_svg()}
              </a>

            </div>
          </div>

          {/* RIGHT PANEL — Content */}
          <div className="menu-overlay-right">

            <div
              data-title={activeTab === 'vehicules' ? tMenu('vehicles_title') : tMenu('locations_title')}
              className={`vehicules-items right-menu-items ${activeTab === 'vehicules' && isMenuOpen ? 'active' : ''}`}
            >
              {voitures.map((car) => (
                <div key={car.id} className="vehicule-item item">
                  <span className="carName">{car.nom}</span>
                  <img src={car.imageUrl || undefined} alt={car.nom} />
                  <div className="carInfo">
                    <span>{toSentenceCase(car.transmission)}</span>
                    <span>{toSentenceCase(car.fuelType)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div
              data-title={tMenu('locations_title')}
              className={`localisations-items right-menu-items ${activeTab === 'localisations' && isMenuOpen ? 'active' : ''}`}
            >
              {locations.map((loc) => (
                <div key={loc.id} className="localisation-item item">
                  <span className="locName">{getTranslatedField(loc, 'nom', locale)}</span>
                  {loc.imageUrl && (
                    <img className="locImg" src={loc.imageUrl} alt={loc.nom} />
                  )}
                  <div className="locInfo">
                    <span>{loc.fraisSupplementaires > 0 ? `${tMenu('fees')} : ${loc.fraisSupplementaires} DH` : tMenu('no_fees')}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Close button */}
          <button className="close-button" onClick={closeMenu} aria-label="Fermer le menu">
            <span>✕</span>
          </button>

        </div>
      </div>
    </>
  );
}