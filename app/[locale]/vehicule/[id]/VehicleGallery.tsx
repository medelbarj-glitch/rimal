'use client';

import React, { useState } from 'react';

export default function VehicleGallery({ images }: { images: string[] }) {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    return (
        <>
            <div className="vd-gallery-grid">
                {images.map((img, idx) => (
                    <div key={idx} className="vd-gallery-img-wrapper" onClick={() => setLightboxImage(img)}>
                        <img src={img} alt={`Galerie ${idx + 1}`} className="vd-gallery-img" loading="lazy" />
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            <div className={`vd-lightbox ${lightboxImage ? 'active' : ''}`} onClick={() => setLightboxImage(null)}>
                {lightboxImage && (
                    <>
                        <button className="vd-lightbox-close" onClick={() => setLightboxImage(null)}>
                            <i className="fas fa-times"></i>
                        </button>
                        <img src={lightboxImage} alt="Enlarged view" className="vd-lightbox-img" onClick={(e) => e.stopPropagation()} />
                    </>
                )}
            </div>
        </>
    );
}
