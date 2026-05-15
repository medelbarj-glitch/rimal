import React from 'react';
import { prisma } from '../../../lib/prisma';
import { NavbarAndMenu } from '../../components/Menu';
import '../../../styles/itineraires.css';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'itineraires' });
    return {
        title: t('meta_title') + ' | Bouderba Rental Cars',
        description: t('meta_desc'),
        alternates: {
            canonical: `https://www.bouderba-rental.com/${locale}/itineraires`,
            languages: {
                fr: 'https://www.bouderba-rental.com/fr/itineraires',
                en: 'https://www.bouderba-rental.com/en/itineraires',
                es: 'https://www.bouderba-rental.com/es/itineraires',
                ar: 'https://www.bouderba-rental.com/ar/itineraires',
            },
        },
    };
}

export default async function ItinerairesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const voitures = await prisma.modeleVoiture.findMany();
    const locations = await prisma.location.findMany();
    const settings = await prisma.setting.findUnique({ where: { id: 1 } });
    const t = await getTranslations({ locale, namespace: 'itineraires' });

    const routes = [
        {
            nameKey: 'route_1_name',
            durationKey: 'route_1_duration',
            distanceKey: 'route_1_distance',
            difficultyKey: 'route_1_difficulty',
            descKey: 'route_1_desc',
            tipKey: 'route_1_tip',
            pois: [
                { nameKey: 'route_1_poi_1', descKey: 'route_1_poi_1_desc' },
                { nameKey: 'route_1_poi_2', descKey: 'route_1_poi_2_desc' },
                { nameKey: 'route_1_poi_3', descKey: 'route_1_poi_3_desc' },
                { nameKey: 'route_1_poi_4', descKey: 'route_1_poi_4_desc' },
            ],
        },
        {
            nameKey: 'route_2_name',
            durationKey: 'route_2_duration',
            distanceKey: 'route_2_distance',
            difficultyKey: 'route_2_difficulty',
            descKey: 'route_2_desc',
            tipKey: 'route_2_tip',
            pois: [
                { nameKey: 'route_2_poi_1', descKey: 'route_2_poi_1_desc' },
                { nameKey: 'route_2_poi_2', descKey: 'route_2_poi_2_desc' },
                { nameKey: 'route_2_poi_3', descKey: 'route_2_poi_3_desc' },
                { nameKey: 'route_2_poi_4', descKey: 'route_2_poi_4_desc' },
            ],
        },
        {
            nameKey: 'route_3_name',
            durationKey: 'route_3_duration',
            distanceKey: 'route_3_distance',
            difficultyKey: 'route_3_difficulty',
            descKey: 'route_3_desc',
            tipKey: 'route_3_tip',
            pois: [
                { nameKey: 'route_3_poi_1', descKey: 'route_3_poi_1_desc' },
                { nameKey: 'route_3_poi_2', descKey: 'route_3_poi_2_desc' },
                { nameKey: 'route_3_poi_3', descKey: 'route_3_poi_3_desc' },
                { nameKey: 'route_3_poi_4', descKey: 'route_3_poi_4_desc' },
            ],
        },
    ];

    return (
        <div className="itin-page">
            <NavbarAndMenu voitures={voitures} locations={locations} isOtherPage={true} logoUrl={settings?.logoUrl || '/default-logo.png'} />

            {/* HERO */}
            <section className="itin-hero">
                <div className="itin-hero-content">
                    <span className="itin-hero-label">{t('hero_label')}</span>
                    <h1 className="itin-hero-title">{t('hero_title')}</h1>
                    <p className="itin-hero-subtitle">{t('hero_subtitle')}</p>
                </div>
            </section>

            {/* ROUTES */}
            <div className="itin-routes">
                {routes.map((route, idx) => (
                    <article key={idx} className="itin-route">
                        {/* Route Header */}
                        <div className="itin-route-header">
                            <h2 className="itin-route-name">{t(route.nameKey as any)}</h2>
                            <p className="itin-route-desc">{t(route.descKey as any)}</p>
                            <div className="itin-route-stats">
                                <div className="itin-stat">
                                    <div className="itin-stat-icon"><i className="fas fa-clock"></i></div>
                                    <div className="itin-stat-info">
                                        <span className="itin-stat-label">{t('duration')}</span>
                                        <span className="itin-stat-value">{t(route.durationKey as any)}</span>
                                    </div>
                                </div>
                                <div className="itin-stat">
                                    <div className="itin-stat-icon"><i className="fas fa-road"></i></div>
                                    <div className="itin-stat-info">
                                        <span className="itin-stat-label">{t('distance')}</span>
                                        <span className="itin-stat-value">{t(route.distanceKey as any)}</span>
                                    </div>
                                </div>
                                <div className="itin-stat">
                                    <div className="itin-stat-icon"><i className="fas fa-tachometer-alt"></i></div>
                                    <div className="itin-stat-info">
                                        <span className="itin-stat-label">{t('difficulty')}</span>
                                        <span className="itin-stat-value">{t(route.difficultyKey as any)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Route Body */}
                        <div className="itin-route-body">
                            <h3><i className="fas fa-map-marker-alt"></i> {t('highlights')}</h3>
                            <div className="itin-timeline">
                                {route.pois.map((poi, j) => (
                                    <div key={j} className="itin-poi">
                                        <h4>{t(poi.nameKey as any)}</h4>
                                        <p>{t(poi.descKey as any)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="itin-tip">
                                <i className="fas fa-lightbulb"></i>
                                <p><strong>{t('pro_tip')} :</strong> {t(route.tipKey as any)}</p>
                            </div>
                        </div>

                        {/* Route Footer */}
                        <div className="itin-route-footer">
                            <a href={`/${locale}/reservation`} className="itin-book-btn">
                                <i className="fas fa-car"></i>
                                {t('book_for_trip')}
                            </a>
                        </div>
                    </article>
                ))}
            </div>

            {/* CTA */}
            <section className="itin-cta">
                <h2>{t('cta_title')}</h2>
                <p>{t('cta_desc')}</p>
                <a href={`/${locale}/reservation`} className="itin-cta-btn">
                    <i className="fas fa-calendar-check"></i>
                    {t('cta_btn')}
                </a>
            </section>
        </div>
    );
}
