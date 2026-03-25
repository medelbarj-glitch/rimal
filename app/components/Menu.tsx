// Fichier : app/components/NavbarAndMenu.tsx

"use client"; // Obligatoire pour les 'useState' et 'onClick'

import React, { useState, useEffect } from 'react';
// Importe le type de données que Prisma nous donne
import { ModeleVoiture, Location } from '@prisma/client';

// 1. Définir les "props" que ce composant reçoit
// Il a besoin de la liste des voitures (récupérée par le serveur)
interface NavbarProps {
  voitures: ModeleVoiture[];
  locations: Location[];
  isOtherPage?: boolean;
}

export function NavbarAndMenu({ voitures, locations, isOtherPage = false }: NavbarProps) {

  // 2. Remplacer les querySelector par des états React
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('vehicules'); // 'vehicules' est l'onglet par défaut
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

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

  useEffect(() => {
    // Fetch global settings for logo
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
      })
      .catch((err) => console.error('Error fetching settings:', err));
  }, []);

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
      {/* 1. La Navbar (le hamburger et le logo) */}
      {/* ================================================= */}
      <nav className={`navbar${isOtherPage ? ' navbar-reservation' : ''}`}>
        <div className="hamburger" onClick={openMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M4 18L20 18" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round"></path>
              <path d="M4 12L20 12" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round"></path>
              <path d="M4 6L20 6" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round"></path>
            </g>
          </svg>
          <span>Menu</span>
        </div>
        <div className="logo">
          <a href="/">
            {logoUrl ? (
              <img src={logoUrl} alt="Bouderba Rental Cars Logo" style={{ maxHeight: '50px', objectFit: 'contain' }} />
            ) : (
              "Bouderba Rental Cars"
            )}
          </a>
        </div>
      </nav>

      {/* ================================================= */}
      {/* 2. Le Menu (l'overlay complet) */}
      {/* ================================================= */}
      <div className={`menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="menu-overlay">

          {/* PANNEAU DE GAUCHE (LES ONGLETS) */}
          <div className="menu-overlay-left" id="menu">
            <div className="items">

              <a
                href="#"
                className={activeTab === 'vehicules' ? 'selected' : ''}
                onClick={(e) => { e.preventDefault(); selectTab('vehicules'); }}
              >
                <span>Nos véhicules</span>
                {arrow_svg()}
              </a>

              <a
                href="#"
                className={activeTab === 'localisations' ? 'selected' : ''}
                onClick={(e) => { e.preventDefault(); selectTab('localisations'); }}
              >
                <span>Nos localisations</span>
                {arrow_svg()}
              </a>

              <a href="/reservation">
                <span>Réservations</span>
                {arrow_svg()}
              </a>

              <a href="/agency">
                <span>Nous contacter</span>
                {arrow_svg()}
              </a>

            </div>
          </div>

          {/* PANNEAU DE DROITE (LE CONTENU DES ONGLETS) */}
          <div className="menu-overlay-right">

            {/* 4. Remplacer le fetch() et innerHTML par un .map() */}
            <div className={`vehicules-items right-menu-items ${activeTab === 'vehicules' && isMenuOpen ? 'active' : ''}`}>
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

            {/* Ce panneau est maintenant dynamique */}
            <div className={`localisations-items right-menu-items ${activeTab === 'localisations' && isMenuOpen ? 'active' : ''}`}>
              {locations.map((loc) => (
                <div key={loc.id} className="localisation-item item">
                  <span className="locName">{loc.nom}</span>
                  {loc.imageUrl && (
                    <img className="locImg" src={loc.imageUrl} alt={loc.nom} />
                  )}
                  <div className="locInfo">
                    <span>{loc.fraisSupplementaires > 0 ? `Frais : ${loc.fraisSupplementaires} DH` : 'Sans frais'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="close-button" onClick={closeMenu}>
            <span>X</span>
          </button>
        </div>
      </div>
    </>
  );
}