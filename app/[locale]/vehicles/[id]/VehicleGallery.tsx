'use client';

import React, { useState, useEffect } from 'react';

export default function VehicleGallery({ images, mainImage }: { images: string[], mainImage?: string }) {
    const allImages = mainImage ? [mainImage, ...images] : images;
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    useEffect(() => {
        if (allImages.length <= 1) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 5000); // Défilement auto toutes les 5s
        return () => clearInterval(timer);
    }, [allImages.length, currentIndex]);

    if (!allImages.length) return null;

    return (
        <div className="vd-slider-wrapper">
            {/* Main Slider Image */}
            <div className="vd-slider-main">
                <img src={allImages[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="vd-slider-img" />
                
                {allImages.length > 1 && (
                    <>
                        <button className="vd-slider-btn prev" onClick={prevSlide}>
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button className="vd-slider-btn next" onClick={nextSlide}>
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails below the main image */}
            {allImages.length > 1 && (
                <div className="vd-slider-thumbnails">
                    {allImages.map((img, idx) => (
                        <div 
                            key={idx} 
                            className={`vd-slider-thumb ${idx === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(idx)}
                        >
                            <img src={img} alt={`Thumbnail ${idx + 1}`} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
