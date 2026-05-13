import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/app/actions/settingsActions';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { NavbarAndMenu } from '@/app/components/Menu';
import { Footer } from '@/app/components/Footer';
import VehicleGallery from './VehicleGallery';
import '@/styles/vehicle-detail.css';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string, id: string }> }): Promise<Metadata> {
    const { locale, id: idStr } = await params;
    const id = parseInt(idStr);
    if (isNaN(id)) return {};

    const modele = await prisma.modeleVoiture.findUnique({ where: { id } });
    if (!modele) return {};

    const t = await getTranslations({ locale });

    const titleMap: Record<string, string> = {
        fr: `Location ${modele.nom} à Marrakech | Bouderba Rental Cars`,
        en: `Rent ${modele.nom} in Marrakech | Bouderba Rental Cars`,
        es: `Alquiler ${modele.nom} en Marrakech | Bouderba Rental Cars`,
        ar: `تأجير ${modele.nom} في مراكش | بودربة لتأجير السيارات`,
    };

    const descMap: Record<string, string> = {
        fr: `Louez la ${modele.nom} à Marrakech dès ${modele.prixParJour} MAD/jour. ${modele.nbPlaces} places, ${modele.transmission}, ${modele.fuelType}. Réservation en ligne, livraison aéroport.`,
        en: `Rent the ${modele.nom} in Marrakech from ${modele.prixParJour} MAD/day. ${modele.nbPlaces} seats, ${modele.transmission}, ${modele.fuelType}. Online booking, airport delivery.`,
        es: `Alquile el ${modele.nom} en Marrakech desde ${modele.prixParJour} MAD/día. ${modele.nbPlaces} plazas, ${modele.transmission}, ${modele.fuelType}. Reserva online.`,
        ar: `استأجر ${modele.nom} في مراكش ابتداءً من ${modele.prixParJour} درهم/يوم. ${modele.nbPlaces} مقاعد. حجز عبر الإنترنت.`,
    };

    return {
        title: titleMap[locale] || titleMap.fr,
        description: descMap[locale] || descMap.fr,
        keywords: [
            `location ${modele.nom} marrakech`,
            `louer ${modele.nom}`,
            `rent ${modele.nom} marrakech`,
            "location voiture marrakech",
            "car rental marrakech",
            "location voiture maroc",
        ],
        openGraph: {
            title: titleMap[locale] || titleMap.fr,
            description: descMap[locale] || descMap.fr,
            type: "website",
            locale: locale === 'fr' ? 'fr_MA' : locale,
            siteName: "Bouderba Rental Cars",
            images: modele.imageUrl ? [{ url: modele.imageUrl, width: 800, height: 600, alt: modele.nom }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: titleMap[locale] || titleMap.fr,
            description: descMap[locale] || descMap.fr,
            images: modele.imageUrl ? [modele.imageUrl] : [],
        },
    };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
    const resolvedParams = await params;
    const locale = resolvedParams.locale;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
        notFound();
    }

    const [modele, voitures, locations, dbSettings] = await Promise.all([
        prisma.modeleVoiture.findUnique({
            where: { id },
            include: { imagesModele: { orderBy: { ordre: 'asc' } } }
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
            <NavbarAndMenu voitures={voitures} locations={locations} isOtherPage={true} logoUrl={dbSettings?.logoUrl || '/default-logo.png'} />

            <div className="vd-new-layout">
                {/* Section Gauche : Slider & Images */}
                <div className="vd-left-col">
                    <VehicleGallery
                        images={modele.imagesModele ? modele.imagesModele.map(img => img.url) : []}
                        mainImage={modele.imageUrl || '/images/default-car.jpg'}
                    />
                </div>

                {/* Section Droite : Détails & Caractéristiques */}
                <div className="vd-right-col">
                    <h1 className="vd-name-title">{modele.nom}</h1>
                    <div className="vd-name-price">
                        {modele.prixParJour} MAD <span className="vd-price-sub">/ {t('vehicles.per_day') || 'jour'}</span>
                    </div>

                    <div className="vd-name-desc">
                        <h3 className="vd-desc-title"><i className="fas fa-info-circle"></i> {t('vehicles.description') || 'À propos'}</h3>
                        <p>{description || "Aucune description détaillée n'est disponible pour ce modèle."}</p>
                    </div>

                    <div className="vd-new-specs-list">
                        <div className="vd-new-spec-item">
                            <span className="vd-ns-label"><i className="fas fa-users"></i> {t('vehicles.places') || 'Places'}</span>
                            <span className="vd-ns-value">{modele.nbPlaces}</span>
                        </div>
                        <div className="vd-new-spec-item">
                            <span className="vd-ns-label"><i className="fas fa-gas-pump"></i> {t('vehicles.carburant') || 'Carburant'}</span>
                            <span className="vd-ns-value">{modele.fuelType}</span>
                        </div>
                        <div className="vd-new-spec-item">
                            <span className="vd-ns-label"><i className="fas fa-cog"></i> {t('vehicles.transmission') || 'Transmission'}</span>
                            <span className="vd-ns-value">{modele.transmission}</span>
                        </div>
                    </div>

                    <a href={`/${locale}/reservation?vehicleId=${modele.id}`} className="vd-new-book-btn">
                        {t('vehicles.reserve') || 'Réserver ce modèle'} <i className="fas fa-calendar-check"></i>
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    );
}
