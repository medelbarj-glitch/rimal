import React from 'react';
import { prisma } from '../../lib/prisma';
import { NavbarAndMenu } from '../components/Menu';
import '../../styles/agency.css'; // Import custom styles

export const metadata = {
    title: "Notre Agence | Bouderba Rental Cars",
    description: "Découvrez notre future agence et contactez-nous.",
};

export default async function AgencePage() {
    const voitures = await prisma.modeleVoiture.findMany();
    const locations = await prisma.location.findMany();

    return (
        <div className="agence-container">
            <NavbarAndMenu voitures={voitures} locations={locations} isOtherPage={true} />

            {/* Main Content Container */}
            <main className="agence-main">

                {/* Header Section */}
                <div className="agence-header">
                    <h1 className="agence-title">
                        Notre Agence
                    </h1>
                    <div className="agence-title-separator"></div>
                    <p className="agence-subtitle">
                        L'excellence à votre service
                    </p>
                </div>

                {/* Content Grid */}
                <div className="agence-grid">

                    {/* Left Column: Image / Visualization */}
                    <div className="agence-visual">
                        <div className="agence-image-container group">
                            <img
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200"
                                alt="Locaux de l'agence (Image Temporaire)"
                                className="w-full h-full object-cover"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div className="agence-image-border"></div>
                        </div>

                        <div className="agence-quote-card">
                            <p className="agence-quote">
                                "Nous construisons un espace moderne et accueillant pour mieux vous servir. Notre nouvelle agence incarnera l'élégance et le confort que vous méritez."
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Information */}
                    <div className="agence-info-col">

                        {/* Contact Card */}
                        <div className="agence-card agence-card-contact group">
                            <div className="agence-deco-circle"></div>

                            <h3 className="agence-card-title first-card">
                                <span className="agence-icon-wrapper">
                                    <i className="fas fa-address-card"></i>
                                </span>
                                Coordonnées
                            </h3>

                            <div className="agence-details-list">
                                <div className="agence-detail-item">
                                    <div className="agence-detail-icon"><i className="fas fa-envelope fa-lg"></i></div>
                                    <div>
                                        <p className="agence-label">Email</p>
                                        <a href="mailto:contact@bouderba-rental.com" className="agence-value">
                                            contact@bouderba-rental.com
                                        </a>
                                    </div>
                                </div>

                                <div className="agence-detail-item">
                                    <div className="agence-detail-icon"><i className="fas fa-phone-alt fa-lg"></i></div>
                                    <div>
                                        <p className="agence-label">Téléphone</p>
                                        <a href="tel:+212600000000" className="agence-value">
                                            +212 6 00 00 00 00
                                        </a>
                                    </div>
                                </div>

                                <div className="agence-detail-item">
                                    <div className="agence-detail-icon"><i className="fas fa-map-marked-alt fa-lg"></i></div>
                                    <div>
                                        <p className="agence-label">Adresse actuelle</p>
                                        <p className="agence-value">
                                            Marrakech, Maroc
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hours Card */}
                        <div className="agence-card agence-card-hours">
                            {/* Decorative circle */}
                            <div className="agence-deco-blur"></div>

                            <h3 className="agence-card-title">
                                <span><i className="fas fa-clock"></i></span>
                                Horaires d'ouverture
                            </h3>

                            <div className="agence-hours-list">
                                <div className="agence-hours-row">
                                    <span className="agence-hours-day">Lundi - Vendredi</span>
                                    <span className="agence-hours-time">09:00 - 20:00</span>
                                </div>
                                <div className="agence-hours-row">
                                    <span className="agence-hours-day">Samedi</span>
                                    <span className="agence-hours-time">10:00 - 18:00</span>
                                </div>
                                <div className="agence-hours-row special">
                                    <span className="agence-hours-day">Dimanche</span>
                                    <span className="agence-badge">Sur Rendez-vous</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
