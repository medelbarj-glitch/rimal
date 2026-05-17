// Fichier : app/components/ImageSlider.tsx

"use client"; // Obligatoire pour les 'useState' et 'useEffect'

import React, { useState, useEffect, useRef, useCallback } from 'react';

import Image from 'next/image';

// Définir le type de données que le slider attend
type SliderImage = {
  src: string;
  title?: string | null; // Rendre title et subtitle optionnels
  subtitle?: string | null;
};

// Définir les "props" que notre composant reçoit
interface ImageSliderProps {
  images: SliderImage[];
  interval?: number; // L'intervalle est optionnel
}

export function ImageSlider({ images, interval = 5000 }: ImageSliderProps) {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour passer à l'image suivante
  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  // Fonction qui REINITIALISE le timer
  // C'est la clé pour "bloquer un peu plus longtemps"
  const resetInterval = useCallback(() => {
    // 1. On efface l'ancien timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // 2. On démarre un NOUVEAU timer de 'interval' (ex: 5 secondes)
    timerRef.current = setInterval(nextImage, interval);
  }, [nextImage, interval]);

  // Gère le démarrage et l'arrêt du slider
  useEffect(() => {
    resetInterval(); // Démarrer l'intervalle au montage
    return () => { // Nettoyer l'intervalle à l'arrêt
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resetInterval]); // Se relance si 'resetInterval' change

  // Fonction pour les clics sur les indicateurs
  const goToSlide = (index: number) => {
    // 1. On change l'image
    setCurrentIndex(index);
    // 2. On réinitialise le timer !
    resetInterval(); 
  };
  // =======================================================

  if (!images || images.length === 0) {
    return null; // Ne rien afficher si pas d'images
  }

  const currentImage = images[currentIndex];

  return (
    <div className="imageSlider">
      {/* Preload first image for LCP, lazy load others */}
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.title || `Slider Image ${i}`}
          fill
          priority={i === 0} // TRÈS IMPORTANT: Précharge la première image pour le LCP
          style={{ 
            objectFit: 'cover', 
            objectPosition: 'center',
            opacity: i === currentIndex ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            zIndex: 0
          }}
          sizes="100vw"
        />
      ))}
      
      <div className="overlay"></div>

      {/* Le 'key' force l'animation CSS à se relancer */}
      <div className="slider-text" key={currentIndex}>
        <h1>{currentImage.title}</h1>
        <p>{currentImage.subtitle}</p>
      </div>

      <div className="slider-indicators">
        {images.map((_, i) => (
          <div
            key={i}
            className={`indicator ${i === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(i)}
          />
        ))}
      </div>
    </div>
  );
}