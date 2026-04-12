"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

// Définition de la structure d'un avis
interface Review {
    id: number;
    author: string;
    rating: number;
    date: string;
    text: string;
}

export function ReviewsSection() {
    const t = useTranslations('reviews');
    // Données factices - facile à remplacer par les données de la BDD plus tard
    const reviews: Review[] = [
        {
            id: 1,
            author: "Karim B.",
            rating: 5,
            date: "Il y a 2 jours",
            text: "Service impeccable ! La voiture était dans un état irréprochable et le chauffeur très professionnel. Je recommande vivement pour tout déplacement de prestige."
        },
        {
            id: 2,
            author: "Sophie M.",
            rating: 5,
            date: "Il y a 1 semaine",
            text: "Une expérience inoubliable. J'ai loué la RS3 pour un week-end, sensations garanties. L'équipe est très réactive et arrangeante."
        },
        {
            id: 3,
            author: "Yassine K.",
            rating: 4,
            date: "Il y a 3 semaines",
            text: "Très bonne agence. Le processus de réservation est simple et rapide. Seul bémol, j'aurais aimé avoir la voiture un peu plus tôt, mais le service client a compensé."
        },
        {
            id: 4,
            author: "Amine D.",
            rating: 5,
            date: "Il y a 1 mois",
            text: "Rien à dire, c'est le top du top sur Marrakech. Les véhicules sont neufs et propres. Le kilométrage illimité est un vrai plus !"
        },
        {
            id: 5,
            author: "Lina R.",
            rating: 5,
            date: "Il y a 1 mois",
            text: "J'ai fait appel à Bouderba Rental pour mon mariage. La voiture a fait son effet ! Merci pour votre professionnalisme."
        },
        {
            id: 6,
            author: "Mehdi T.",
            rating: 5,
            date: "Il y a 2 mois",
            text: "Client fidèle depuis un an, je n'ai jamais été déçu. La qualité de service est constante. Bravo à toute l'équipe."
        }
    ];

    // Dupliquer la liste pour créer l'effet de boucle infinie
    // Nous avons besoin d'assez d'éléments pour remplir la largeur de l'écran + marge
    const infiniteReviews = [...reviews, ...reviews];

    return (
        <section className="reviews-section">
            <h2>{t('title')}</h2>

            <div className="reviews-track-container">
                <div className="reviews-track">
                    {infiniteReviews.map((review, index) => (
                        <div key={`${review.id}-${index}`} className="review-card">
                            <div className="review-header">
                                <div className="review-stars">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <i key={i} className="fas fa-star"></i>
                                    ))}
                                </div>
                                <span className="review-date">{review.date}</span>
                            </div>
                            <p className="review-text">"{review.text}"</p>
                            <div className="review-author">
                                {review.author}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
