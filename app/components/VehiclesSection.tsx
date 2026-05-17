// Fichier : app/components/VehiclesSection.tsx

"use client";

"use client"; // Obligatoire, car IntersectionObserver est une API du navigateur

import React from 'react';
// Importe le type de données de Prisma (la page serveur nous les enverra)
import { ModeleVoiture } from '@prisma/client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCurrency } from '../context/CurrencyContext';

// 1. Définir les "props" que ce composant reçoit
interface VehiclesSectionProps {
  voitures: (ModeleVoiture & { prixSaisonniers?: any[] })[]; // Il reçoit les voitures du serveur
  searchParams?: { [key: string]: string | string[] | undefined };
}

export function VehiclesSection({ voitures, searchParams }: VehiclesSectionProps) {
  const t = useTranslations('vehicles');
  const { formatPrice } = useCurrency();

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

  // Helper pour vérifier si une promo est active aujourd'hui
  const getPromoInfo = (car: any) => {
    // Check if promotion is active and has all required data
    if (!car.promotionActive || car.promotionPrixParJour === null || car.promotionPrixParJour === undefined) return null;
    if (!car.promotionDateDebut || !car.promotionDateFin) return null;

    try {
      const today = new Date();
      // Normalize today to start of day for comparison
      const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

      const start = new Date(car.promotionDateDebut);
      const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();

      const end = new Date(car.promotionDateFin);
      const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();

      if (todayTime >= startTime && todayTime <= endTime) {
        return car.promotionPrixParJour;
      }
    } catch (e) {
      console.error("Error calculating promo info", e);
    }

    return null;
  };

  // 4. Rendu du TSX
  // Remplace votre 'fetch' et 'innerHTML'
  return (
    <div
      className="vehicules"
    >
      {/* <h1>Nos Véhicules</h1> */}
      <div className="vehicules-container">

        {/* On boucle sur les 'voitures' reçues en props */}
        {voitures.map((car) => {
          const promoPrice = getPromoInfo(car);
          const basePrice = car.prixSaisonniers && car.prixSaisonniers.length > 0 ? Math.min(car.prixParJour, ...car.prixSaisonniers.map(s => s.prixParJour)) : car.prixParJour;

          return (
            <div key={car.id} className="vehicule" style={{ position: 'relative' }}>
              {promoPrice && (
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', zIndex: 10 }}>
                  <span className="promo-badge-premium">
                    <i className="fas fa-tag"></i> Promo
                  </span>
                </div>
              )}
              <div className="vehicule-top-info">
                <Link href={`/vehicles/${car.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h2>{car.nom}</h2>
                </Link>
                <div className="carInfo">
                  {/* On utilise les vrais champs de la BDD */}
                  <span>{toSentenceCase(car.transmission)}</span>
                  <span>{toSentenceCase(car.fuelType)}</span>
                </div>
              </div>

              <Link href={`/vehicles/${car.id}`}>
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
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                  {promoPrice ? (
                    <>
                      <span className="old-price" style={{ fontSize: '1.1rem', color: '#111', fontWeight: 600 }}>{t('from')} <span className="price-crossed-out">{formatPrice(basePrice)}</span></span>
                      <span className="price price-promo" style={{ fontSize: '1.1rem', color: '#111', fontWeight: 600 }}>
                        <strong style={{ color: "red", fontSize: '1.8rem', fontFamily: 'Anton, sans-serif' }}>{formatPrice(promoPrice)}</strong> {t('per_day')}
                      </span>
                    </>
                  ) : (
                    <span className="price">
                      {t('from')} <strong>{formatPrice(basePrice)}</strong> {t('per_day')}
                    </span>
                  )}
                </div>
                <div className="buttons-container">
                  <Link href={getReservationUrl(car.id)} className="reserve-button">
                    {t('reserve')}
                  </Link>
                  <Link href={`/vehicles/${car.id}`} className="details-button">
                    {t('details')}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}