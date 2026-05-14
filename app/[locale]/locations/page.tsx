import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/app/actions/settingsActions';
import { getTranslations } from 'next-intl/server';
import { NavbarAndMenu } from '@/app/components/Menu';
import { Footer } from '@/app/components/Footer';
import { getTranslatedField } from '@/lib/translate';
import '@/styles/locations.css';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });

    const titleMap: Record<string, string> = {
        fr: `Nos Agences et Localisations | Bouderba Rental Cars`,
        en: `Our Agencies and Locations | Bouderba Rental Cars`,
        es: `Nuestras Agencias y Ubicaciones | Bouderba Rental Cars`,
        ar: `وكالاتنا ومواقعنا | بودربة لتأجير السيارات`,
    };

    const descMap: Record<string, string> = {
        fr: `Découvrez nos points de retrait et agences à Marrakech. Réservez votre véhicule et récupérez-le facilement.`,
        en: `Discover our pickup points and agencies in Marrakech. Book your vehicle and pick it up easily.`,
        es: `Descubra nuestros puntos de recogida y agencias en Marrakech. Reserve su vehículo y recójalo fácilmente.`,
        ar: `اكتشف نقاط الاستلام ووكالاتنا في مراكش. احجز سيارتك واستلمها بسهولة.`,
    };

    return {
        title: titleMap[locale] || titleMap.fr,
        description: descMap[locale] || descMap.fr,
        alternates: {
            canonical: `https://www.bouderba-rental.com/${locale}/locations`,
            languages: {
                fr: 'https://www.bouderba-rental.com/fr/locations',
                en: 'https://www.bouderba-rental.com/en/locations',
                es: 'https://www.bouderba-rental.com/es/locations',
                ar: 'https://www.bouderba-rental.com/ar/locations',
            },
        },
    };
}

export default async function LocationsPage({ params }: { params: Promise<{ locale: string }> }) {
    const resolvedParams = await params;
    const locale = resolvedParams.locale;

    const [voitures, locations, dbSettings] = await Promise.all([
        prisma.modeleVoiture.findMany(),
        prisma.location.findMany({
            include: { horaires: true }
        }),
        getSettings()
    ]);

    const t = await getTranslations({ locale });

    // Helper to translate DayOfWeek enum
    const translateDay = (day: string) => {
        const mapping: Record<string, string> = {
            'LUNDI': t('agency.monday'),
            'MARDI': t('agency.tuesday'),
            'MERCREDI': t('agency.wednesday'),
            'JEUDI': t('agency.thursday'),
            'VENDREDI': t('agency.friday'),
            'SAMEDI': t('agency.saturday'),
            'DIMANCHE': t('agency.sunday'),
        };
        return mapping[day] || day;
    };

    return (
        <div className="locations-page">
            <NavbarAndMenu voitures={voitures} locations={locations} isOtherPage={true} logoUrl={dbSettings?.logoUrl || '/default-logo.png'} />

            {/* Hero Section */}
            <section className="loc-hero">
                {/* Background image for hero. Could be a specific image or fallback */}
                <img src="/images/hero-bg.jpg" alt="Locations Hero" className="loc-hero-bg" style={{position:'absolute', width:'100%', height:'100%', objectFit:'cover'}} />
                <div className="loc-hero-overlay"></div>
                <div className="loc-hero-content">
                    <h1 className="loc-hero-title">{t('locations_page.title') || 'Nos Localisations'}</h1>
                    <p className="loc-hero-subtitle">{t('locations_page.subtitle') || 'Retrouvez-nous facilement à Marrakech et ses environs.'}</p>
                </div>
            </section>

            <div className="loc-container">
                <div className="loc-grid">
                    {locations.map((loc) => {
                        const locName = getTranslatedField(loc, 'nom', locale);
                        return (
                            <div key={loc.id} className="loc-card">
                                <div className="loc-img-wrapper">
                                    <img 
                                        src={loc.imageUrl || '/images/default-location.jpg'} 
                                        alt={locName} 
                                        className="loc-img" 
                                    />
                                    {loc.fraisSupplementaires > 0 ? (
                                        <div className="loc-fees-badge">
                                            {t('locations_page.fees')} {loc.fraisSupplementaires} MAD
                                        </div>
                                    ) : (
                                        <div className="loc-fees-badge free">
                                            {t('locations_page.no_fees')}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="loc-info">
                                    <h2 className="loc-name">{locName}</h2>
                                    
                                    <div className="loc-address">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <span>{loc.adresse || t('locations_page.address') + ' Marrakech, Maroc'}</span>
                                    </div>

                                    {loc.horaires && loc.horaires.length > 0 && (
                                        <div className="loc-hours-section">
                                            <h3 className="loc-hours-title">
                                                <i className="far fa-clock"></i> {t('locations_page.hours') || 'Horaires :'}
                                            </h3>
                                            <div className="loc-hours-list">
                                                {loc.horaires.map((horaire) => (
                                                    <div key={horaire.id} className={`loc-hour-item ${horaire.isClosed ? 'closed' : ''}`}>
                                                        <span>{translateDay(horaire.dayOfWeek)}</span>
                                                        <span>
                                                            {horaire.isClosed 
                                                                ? (t('locations_page.closed') || 'Fermé')
                                                                : `${horaire.openTime || ''} - ${horaire.closeTime || ''} ${horaire.openTimeAfternoon ? ` / ${horaire.openTimeAfternoon} - ${horaire.closeTimeAfternoon}` : ''}`
                                                            }
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <a href={`/${locale}/reservation?pickup=${loc.id}`} className="loc-book-btn">
                                        {t('locations_page.reserve_here') || 'Réserver ici'} <i className="fas fa-arrow-right" style={{marginLeft: '8px'}}></i>
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Footer />
        </div>
    );
}
