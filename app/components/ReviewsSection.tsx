"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

// Définition de la structure d'un avis depuis Google Maps
interface GoogleReview {
    author_name: string;
    rating: number;
    relative_time_description: string;
    text: string;
    author_url: string; // Nous n'utiliserons plus celui-ci directement
}

export function ReviewsSection() {
    const t = useTranslations('reviews');
    const [reviews, setReviews] = useState<GoogleReview[]>([]);
    const [placeUrl, setPlaceUrl] = useState<string>(''); // Nouvel état pour l'URL de l'entreprise
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('/api/reviews');
                if (response.ok) {
                    const data = await response.json();
                    if (data.reviews && data.reviews.length > 0) {
                        setReviews(data.reviews);
                        if (data.url) {
                            setPlaceUrl(data.url); // On sauvegarde l'URL de l'entreprise
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch Google reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    // Dupliquer la liste pour créer l'effet de boucle infinie
    // Nous avons besoin d'assez d'éléments pour remplir la largeur de l'écran + marge
    const getInfiniteReviews = () => {
        if (reviews.length === 0) return [];
        // On s'assure d'avoir assez d'avis pour la boucle infinie, même s'il n'y en a que 5
        const multiplier = reviews.length <= 5 ? 4 : 2;
        let result: GoogleReview[] = [];
        for (let i = 0; i < multiplier; i++) {
            result = [...result, ...reviews];
        }
        return result;
    };

    const infiniteReviews = getInfiniteReviews();

    if (loading) {
        return (
            <section className="reviews-section">
                <h2>{t('title')}</h2>
                <div className="reviews-track-container" style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <i className="fas fa-circle-notch fa-spin fa-2x" style={{ color: '#B49339' }}></i>
                </div>
            </section>
        );
    }

    if (reviews.length === 0) {
        return null; // Ne rien afficher si aucun avis n'a pu être chargé
    }

    return (
        <section className="reviews-section">
            <h2>{t('title')}</h2>

            <div className="reviews-track-container">
                <div className="reviews-track">
                    {infiniteReviews.map((review, index) => (
                        <a 
                            key={`review-${index}`} 
                            href={placeUrl || review.author_url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="review-card"
                            style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}
                        >
                            <div className="review-header">
                                <div className="review-stars">
                                    {[...Array(Math.max(0, Math.min(5, Math.floor(review.rating))))].map((_, i) => (
                                        <i key={i} className="fas fa-star" style={{ color: '#ECC242' }}></i>
                                    ))}
                                </div>
                                <span className="review-date">{review.relative_time_description}</span>
                            </div>
                            <p className="review-text">"{review.text}"</p>
                            <div className="review-author">
                                {review.author_name}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
