import React from 'react';
import { prisma } from '../../../lib/prisma';
import { NavbarAndMenu } from '../../components/Menu';
import '../../../styles/agency.css';
import { getSettings } from '@/app/actions/settingsActions';

export const metadata = {
    title: "Notre Agence | Bouderba Rental Cars",
    description: "Découvrez Bouderba Rental Cars, votre partenaire de confiance pour la location de voitures à Marrakech. Contactez-nous.",
};

export default async function AgencePage() {
    const voitures = await prisma.modeleVoiture.findMany();
    const locations = await prisma.location.findMany();

    const dbSettings = await getSettings();
    const phoneNumber = dbSettings?.phoneNumber || "+212 6 67 33 28 34";
    const cleanPhoneNumber = phoneNumber.replace(/[^0-9+]/g, '');
    const whatsappMessage = encodeURIComponent("Bonjour, je suis intéressé par la location d'une voiture.");

    return (
        <>

            <div className="agency-page">

                {/* ============ HERO ============ */}
                <section className="agency-hero">
                    <div className="agency-hero-content">
                        <span className="agency-hero-label">Bouderba Rental Cars</span>
                        <h1 className="agency-hero-title">Notre Agence</h1>
                        <p className="agency-hero-subtitle">
                            L'excellence automobile à votre service depuis Marrakech.
                            Un accompagnement personnalisé pour chaque trajet.
                        </p>
                        <div className="agency-hero-actions">
                            <a href={`tel:${cleanPhoneNumber}`} className="agency-btn agency-btn-gold">
                                <i className="fas fa-phone-alt"></i>
                                Appelez-nous
                            </a>
                            <a href={`https://wa.me/${cleanPhoneNumber}?text=${whatsappMessage}`}
                                target="_blank" rel="noopener noreferrer"
                                className="agency-btn agency-btn-outline">
                                <i className="fab fa-whatsapp"></i>
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </section>

                {/* ============ STATS BAR ============ */}
                <section className="agency-stats-bar">
                    <div className="agency-stat">
                        <span className="agency-stat-number">5+</span>
                        <span className="agency-stat-label">Années d'expérience</span>
                    </div>
                    <div className="agency-stat-divider"></div>
                    <div className="agency-stat">
                        <span className="agency-stat-number">{voitures.length}+</span>
                        <span className="agency-stat-label">Véhicules disponibles</span>
                    </div>
                    <div className="agency-stat-divider"></div>
                    <div className="agency-stat">
                        <span className="agency-stat-number">{locations.length}</span>
                        <span className="agency-stat-label">Points de retrait</span>
                    </div>
                    <div className="agency-stat-divider"></div>
                    <div className="agency-stat">
                        <span className="agency-stat-number">24/7</span>
                        <span className="agency-stat-label">Assistance client</span>
                    </div>
                </section>

                {/* ============ ABOUT SECTION ============ */}
                <section className="agency-section">
                    <div className="agency-section-header">
                        <h2 className="agency-section-title">Qui sommes-nous ?</h2>
                    </div>
                    <div className="agency-about-grid">
                        <div className="agency-about-text">
                            <p>
                                <strong>Bouderba Rental Cars</strong> est une agence de location de véhicules basée à
                                <strong> Marrakech</strong>, au cœur du Maroc. Fondée sur des valeurs de confiance,
                                de qualité et de proximité, nous mettons à votre disposition une flotte de véhicules
                                soigneusement entretenus pour répondre à tous vos besoins de déplacement.
                            </p>
                            <p>
                                Que ce soit pour un voyage d'affaires, des vacances en famille ou une simple escapade,
                                notre équipe vous accompagne avec un service personnalisé et professionnel. Nous croyons
                                que chaque client mérite une expérience de location fluide, transparente et sans surprise.
                            </p>
                        </div>
                        <div className="agency-values-grid">
                            <div className="agency-value-card">
                                <div className="agency-value-icon"><i className="fas fa-gem"></i></div>
                                <h4>Qualité Premium</h4>
                                <p>Véhicules récents et parfaitement entretenus pour votre confort et sécurité.</p>
                            </div>
                            <div className="agency-value-card">
                                <div className="agency-value-icon"><i className="fas fa-handshake"></i></div>
                                <h4>Confiance</h4>
                                <p>Transparence totale sur les tarifs, aucun frais caché, un contrat clair.</p>
                            </div>
                            <div className="agency-value-card">
                                <div className="agency-value-icon"><i className="fas fa-headset"></i></div>
                                <h4>Disponibilité</h4>
                                <p>Une équipe réactive, joignable 7j/7 pour vous assister à tout moment.</p>
                            </div>
                            <div className="agency-value-card">
                                <div className="agency-value-icon"><i className="fas fa-map-marker-alt"></i></div>
                                <h4>Flexibilité</h4>
                                <p>Livraison et récupération du véhicule où vous le souhaitez à Marrakech.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============ CONTACT + HOURS ============ */}
                <section className="agency-section">
                    <div className="agency-section-header">
                        <h2 className="agency-section-title">Nous contacter</h2>
                    </div>
                    <div className="agency-contact-grid">

                        {/* Contact details card */}
                        <div className="agency-card">
                            <div className="agency-card-icon-row">
                                <div className="agency-card-icon"><i className="fas fa-address-card"></i></div>
                                <h3>Coordonnées</h3>
                            </div>
                            <div className="agency-contact-list">
                                <a href={`mailto:contact@bouderba-rental.com`} className="agency-contact-item">
                                    <div className="agency-ci-icon"><i className="fas fa-envelope"></i></div>
                                    <div>
                                        <span className="agency-ci-label">Email</span>
                                        <span className="agency-ci-value">contact@bouderba-rental.com</span>
                                    </div>
                                </a>
                                <a href={`tel:${cleanPhoneNumber}`} className="agency-contact-item">
                                    <div className="agency-ci-icon"><i className="fas fa-phone-alt"></i></div>
                                    <div>
                                        <span className="agency-ci-label">Téléphone</span>
                                        <span className="agency-ci-value">{phoneNumber}</span>
                                    </div>
                                </a>
                                <a href={`https://wa.me/${cleanPhoneNumber}?text=${whatsappMessage}`}
                                    target="_blank" rel="noopener noreferrer" className="agency-contact-item">
                                    <div className="agency-ci-icon whatsapp"><i className="fab fa-whatsapp"></i></div>
                                    <div>
                                        <span className="agency-ci-label">WhatsApp</span>
                                        <span className="agency-ci-value">Envoyez-nous un message</span>
                                    </div>
                                </a>
                                <div className="agency-contact-item">
                                    <div className="agency-ci-icon"><i className="fas fa-map-marked-alt"></i></div>
                                    <div>
                                        <span className="agency-ci-label">Adresse</span>
                                        <span className="agency-ci-value">Marrakech, Maroc</span>
                                    </div>
                                </div>
                                <a href="https://www.instagram.com/bouderba.rental.cars" target="_blank" rel="noopener noreferrer" className="agency-contact-item">
                                    <div className="agency-ci-icon instagram"><i className="fab fa-instagram"></i></div>
                                    <div>
                                        <span className="agency-ci-label">Instagram</span>
                                        <span className="agency-ci-value">@bouderba.rental.cars</span>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Hours card */}
                        <div className="agency-card agency-card-dark">
                            <div className="agency-card-icon-row">
                                <div className="agency-card-icon gold"><i className="fas fa-clock"></i></div>
                                <h3>Horaires d'ouverture</h3>
                            </div>
                            <div className="agency-hours-list">
                                <div className="agency-hours-row">
                                    <span className="agency-hours-day">Lundi</span>
                                    <span className="agency-hours-time">09:00 — 20:00</span>
                                </div>
                                <div className="agency-hours-row">
                                    <span className="agency-hours-day">Mardi</span>
                                    <span className="agency-hours-time">09:00 — 20:00</span>
                                </div>
                                <div className="agency-hours-row">
                                    <span className="agency-hours-day">Mercredi</span>
                                    <span className="agency-hours-time">09:00 — 20:00</span>
                                </div>
                                <div className="agency-hours-row">
                                    <span className="agency-hours-day">Jeudi</span>
                                    <span className="agency-hours-time">09:00 — 20:00</span>
                                </div>
                                <div className="agency-hours-row">
                                    <span className="agency-hours-day">Vendredi</span>
                                    <span className="agency-hours-time">09:00 — 20:00</span>
                                </div>
                                <div className="agency-hours-row">
                                    <span className="agency-hours-day">Samedi</span>
                                    <span className="agency-hours-time">10:00 — 18:00</span>
                                </div>
                                <div className="agency-hours-row special">
                                    <span className="agency-hours-day">Dimanche</span>
                                    <span className="agency-badge">Sur rendez-vous</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ============ HOW IT WORKS ============ */}
                <section className="agency-section">
                    <div className="agency-section-header">
                        <h2 className="agency-section-title">Comment ça marche ?</h2>
                    </div>
                    <div className="agency-steps">
                        <div className="agency-step">
                            <div className="agency-step-number">01</div>
                            <h4>Choisissez votre véhicule</h4>
                            <p>Parcourez notre catalogue et sélectionnez le véhicule qui correspond à vos besoins et à votre budget.</p>
                        </div>
                        <div className="agency-step-arrow"><i className="fas fa-chevron-right"></i></div>
                        <div className="agency-step">
                            <div className="agency-step-number">02</div>
                            <h4>Réservez en ligne</h4>
                            <p>Remplissez le formulaire de réservation avec vos dates, lieux et coordonnées. C'est rapide et simple.</p>
                        </div>
                        <div className="agency-step-arrow"><i className="fas fa-chevron-right"></i></div>
                        <div className="agency-step">
                            <div className="agency-step-number">03</div>
                            <h4>Récupérez les clés</h4>
                            <p>Nous vous livrons le véhicule à l'endroit convenu ou vous venez le chercher. Profitez de votre trajet !</p>
                        </div>
                    </div>
                </section>

                {/* ============ CTA ============ */}
                <section className="agency-cta">
                    <h2>Prêt à prendre la route ?</h2>
                    <p>Réservez dès maintenant et profitez d'un service de location premium.</p>
                    <div className="agency-cta-actions">
                        <a href="/reservation" className="agency-btn agency-btn-gold">
                            <i className="fas fa-calendar-check"></i>
                            Réserver maintenant
                        </a>
                        <a href={`tel:${cleanPhoneNumber}`} className="agency-btn agency-btn-white">
                            <i className="fas fa-phone-alt"></i>
                            {phoneNumber}
                        </a>
                    </div>
                </section>

            </div>
        </>
    );
}
