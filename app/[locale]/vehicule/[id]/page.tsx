import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/app/actions/settingsActions';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { NavbarAndMenu } from '@/app/components/Menu';
import { Footer } from '@/app/components/Footer';
import VehicleGallery from './VehicleGallery';
import '@/styles/vehicle-detail.css';

export const dynamic = 'force-dynamic';

export default async function VehicleDetailPage({ params }: { params: { locale: string, id: string } }) {
    const locale = params.locale;
    const id = parseInt(params.id);

    if (isNaN(id)) {
        notFound();
    }

    const [modele, voitures, locations, dbSettings] = await Promise.all([
        prisma.modeleVoiture.findUnique({
            where: { id },
            include: { imagesModele: true }
        }),
        prisma.modeleVoiture.findMany(),
        prisma.location.findMany(),
        getSettings()
    ]);

    if (!modele) {
        notFound();
    }

    const t = await getTranslations({ locale });

    // Extraction de la description correcte selon la langue
    let description = modele.description;
    if (locale === 'en' && (modele as any).description_en) description = (modele as any).description_en;
    if (locale === 'es' && (modele as any).description_es) description = (modele as any).description_es;
    if (locale === 'ar' && (modele as any).description_ar) description = (modele as any).description_ar;

    return (
        <div className="vehicle-detail-page">
            <NavbarAndMenu voitures={voitures} locations={locations} logoUrl={dbSettings?.logoUrl || '/default-logo.png'} />

            <section className="vd-hero">
                <img src={modele.imageUrl || '/images/default-car.jpg'} alt={modele.nom} className="vd-hero-bg" />
                <div className="vd-hero-overlay"></div>
                <div className="vd-hero-content">
                    <h1 className="vd-title">{modele.nom}</h1>
                    <div className="vd-price-badge">{modele.prixParJour} MAD / {t('vehicles.per_day') || 'jour'}</div>
                </div>
            </section>

            <div className="vd-container">
                {/* Left Column */}
                <div className="vd-main-content">
                    <h2 className="vd-section-title">
                        <i className="fas fa-info-circle"></i> {t('vehicles.description') || 'À propos de ce véhicule'}
                    </h2>
                    <p className="vd-description">
                        {description || "Aucune description détaillée n'est disponible pour ce modèle."}
                    </p>

                    {modele.imagesModele && modele.imagesModele.length > 0 && (
                        <>
                            <h2 className="vd-section-title" style={{ marginTop: '50px' }}>
                                <i className="fas fa-camera-retro"></i> {t('vehicles.galerie') || 'Galerie Photos'}
                            </h2>
                            <VehicleGallery images={modele.imagesModele.map(img => img.url)} />
                        </>
                    )}
                </div>

                {/* Right Column (Sidebar) */}
                <aside className="vd-sidebar">
                    <h2 className="vd-section-title" style={{ marginBottom: '30px' }}>
                        <i className="fas fa-cogs"></i> {t('vehicles.caracteristiques') || 'Caractéristiques'}
                    </h2>
                    
                    <div className="vd-specs-list">
                        <div className="vd-spec-item">
                            <span className="vd-spec-label"><i className="fas fa-users"></i> {t('vehicles.places') || 'Places'}</span>
                            <span className="vd-spec-value">{modele.nbPlaces}</span>
                        </div>
                        <div className="vd-spec-item">
                            <span className="vd-spec-label"><i className="fas fa-gas-pump"></i> {t('vehicles.carburant') || 'Carburant'}</span>
                            <span className="vd-spec-value">{modele.fuelType}</span>
                        </div>
                        <div className="vd-spec-item">
                            <span className="vd-spec-label"><i className="fas fa-cog"></i> {t('vehicles.transmission') || 'Transmission'}</span>
                            <span className="vd-spec-value">{modele.transmission}</span>
                        </div>
                    </div>

                    <a href={`/${locale}/reservation?vehicleId=${modele.id}`} className="vd-book-btn">
                        {t('vehicles.reserve') || 'Réserver ce modèle'} <i className="fas fa-arrow-right"></i>
                    </a>
                </aside>
            </div>

            <Footer />
        </div>
    );
}
