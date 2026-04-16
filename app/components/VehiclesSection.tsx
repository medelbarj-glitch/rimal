// Fichier : app/components/VehiclesSection.tsx

"use client"; // Obligatoire, car IntersectionObserver est une API du navigateur
// Fichier : app/components/VehiclesSection.tsx

"use client"; // Obligatoire, car IntersectionObserver est une API du navigateur

import React, { useEffect, useRef, useState } from 'react';
// Importe le type de données de Prisma (la page serveur nous les enverra)
import { ModeleVoiture } from '@prisma/client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCurrency } from '../context/CurrencyContext';

// 1. Définir les "props" que ce composant reçoit
interface VehiclesSectionProps {
  voitures: ModeleVoiture[]; // Il reçoit les voitures du serveur
  searchParams?: { [key: string]: string | string[] | undefined };
}

export function VehiclesSection({ voitures, searchParams }: VehiclesSectionProps) {
  const t = useTranslations('vehicles');
  const { formatPrice } = useCurrency();

  // 2. Remplacer document.querySelector par des "états" et "refs"
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null); // Pour pointer vers la div .vehicules

  // 3. Conversion de votre IntersectionObserver
  // useEffect se lance quand le composant est "monté" (chargé)
  useEffect(() => {

    // La logique de l'observer est identique
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]; // On n'observe qu'un élément
        if (entry.isIntersecting) {
          setIsVisible(true); // On met à jour l'état
          observer.unobserve(entry.target); // On arrête d'observer (animation 1 fois)
        }
      },
      { threshold: 0.2 } // 20% visible
    );

    // On attache l'observer à notre élément (la div .vehicules)
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Fonction de "nettoyage" (quand le composant est retiré)
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []); // Le tableau vide [] signifie "lance ceci 1 seule fois"

  function toSentenceCase(str: string): string {
    if (!str) return ''; // Gère les cas où la chaîne est vide

    const firstLetter = str.charAt(0).toUpperCase();
    const rest = str.slice(1).toLowerCase();

    return firstLetter + rest;
  }

  // Helper pour construire l'URL de réservation
  const getReservationUrl = (carId: number) => {
    const params = new URLSearchParams();
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (typeof value === 'string') {
          params.set(key, value);
        }
      });
    }
    return `/reservation/${carId}?${params.toString()}`;
  };

  // 4. Rendu du TSX
  // Remplace votre 'fetch' et 'innerHTML'
  return (
    <div
      className={`vehicules ${isVisible ? 'visible' : ''}`}
      ref={sectionRef} // On lie la ref à cette div
    >
      {/* <h1>Nos Véhicules</h1> */}
      <div className="vehicules-container">

        {/* On boucle sur les 'voitures' reçues en props */}
        {voitures.map((car) => (
          <div key={car.id} className="vehicule">
            <div className="vehicule-top-info">
              <Link href={`/vehicule/${car.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h2>{car.nom}</h2>
              </Link>
              <div className="carInfo">
                {/* On utilise les vrais champs de la BDD */}
                <span>{toSentenceCase(car.transmission)}</span>
                <span>{toSentenceCase(car.fuelType)}</span>
              </div>
            </div>

            <Link href={`/vehicule/${car.id}`}>
              <img 
                src={car.imageUrl?.includes('cloudinary') ? car.imageUrl.replace('/upload/', '/upload/f_auto,q_auto,w_500,h_350,c_fill/') : car.imageUrl || undefined} 
                alt={car.nom} 
                style={{ cursor: 'pointer' }}
                width="500"
                height="350"
                loading="lazy"
              />
            </Link>

            <div className="vehicule-bottom-info">
              <span className="price">
                {t('from')} <strong>{formatPrice(car.prixParJour)}</strong> {t('per_day')}
              </span>
              <div className="buttons-container">
                <Link href={getReservationUrl(car.id)} className="reserve-button">
                  {t('reserve')}
                </Link>
                <Link href={`/vehicule/${car.id}`} className="details-button">
                  {t('details')}
                </Link>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}