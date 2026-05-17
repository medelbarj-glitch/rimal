export const dynamic = 'force-dynamic';

import React from 'react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        alternates: {
            canonical: `https://www.bouderba-rental.com/${locale}`,
            languages: {
                fr: 'https://www.bouderba-rental.com/fr',
                en: 'https://www.bouderba-rental.com/en',
                es: 'https://www.bouderba-rental.com/es',
                ar: 'https://www.bouderba-rental.com/ar',
            },
        },
    };
}

// Importation des polices et bibliothèques
import { prisma } from '../../lib/prisma'; // Connexion à la BDD
import { ImageSlider } from '../components/ImageSlider';
import { BackgroundImage, ModeleVoiture } from '@prisma/client';
import { NavbarAndMenu } from '../components/Menu';
import { VehiclesSection } from '../components/VehiclesSection';
import { ReservationForm } from '../components/ReservationForm';
import { ServicesSection } from '../components/ServicesSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { ScrollReveal } from '../components/ScrollReveal';

const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00"
];

import { getTranslations, getLocale } from 'next-intl/server';
import { getTranslatedField } from '@/lib/translate';

export default async function Home() {
    const t = await getTranslations();
    const locale = await getLocale();
    // 2. RÉCUPÉRER LES DONNÉES EN PARALLÈLE DEPUIS LA BDD AVEC Promise.all
    const [
        sliderImagesFromDb,
        servicesData,
        experienceData,
        voitures,
        locations,
        settings
    ] = await Promise.all([
        prisma.backgroundImage.findMany({
            orderBy: {
                createdAt: 'asc',
            },
        }),
        prisma.service.findMany({
            orderBy: { ordre: 'asc' }
        }),
        prisma.experience.findMany({
            orderBy: { createdAt: 'asc' }
        }),
        prisma.modeleVoiture.findMany({
            include: { prixSaisonniers: true }
        }),
        prisma.location.findMany(),
        prisma.setting.findUnique({ where: { id: 1 } })
    ]);

    const sliderData = sliderImagesFromDb.map((image: BackgroundImage) => ({
        src: image.url,
        title: getTranslatedField(image, 'title', locale) || image.name,
        subtitle: getTranslatedField(image, 'subtitle', locale) || '',
    }));

    const logoUrl = settings?.logoUrl || '/default-logo.png';
    return (
        <>
            <NavbarAndMenu voitures={voitures} locations={locations} logoUrl={logoUrl} />

            {/* Slider doesn't need reveal usually, or can be separate */}
            <ImageSlider images={sliderData} interval={5000} />

            <div className="reservation-wrapper-fix" id="reservations">
                <ReservationForm locations={locations} hours={timeSlots} />
            </div>

            {/* New Services Section */}
            <ScrollReveal>
                <ServicesSection services={servicesData} />
            </ScrollReveal>

            <h1 className="vehicules-title" id="vehicules">{t('vehicles.title')}</h1>
            <VehiclesSection voitures={voitures} />

            {/* New Experience Section */}
            <ScrollReveal>
                <ExperienceSection experiences={experienceData} />
            </ScrollReveal>

            {/* Discover Marrakech Section */}
            <ScrollReveal>
                <section className="discover-section">
                    <div className="discover-header">
                        <span className="discover-label">{t('discover.label')}</span>
                        <h2 className="discover-title">{t('discover.title')}</h2>
                        <p className="discover-subtitle">{t('discover.subtitle')}</p>
                    </div>
                    <div className="discover-grid">

                        {/* Guide Card */}
                        <a href={`/${locale}/guide-marrakech`} className="discover-card">
                            <div className="discover-card-visual">
                                <span className="discover-card-emoji">🕌</span>
                                <div className="discover-card-badge">
                                    <i className="fas fa-compass"></i>
                                </div>
                            </div>
                            <div className="discover-card-body">
                                <h3>{t('discover.guide_title')}</h3>
                                <p className="discover-card-desc">{t('discover.guide_desc')}</p>
                                <ul className="discover-card-highlights">
                                    <li><i className="fas fa-star"></i> {t('discover.guide_h1')}</li>
                                    <li><i className="fas fa-utensils"></i> {t('discover.guide_h2')}</li>
                                    <li><i className="fas fa-spa"></i> {t('discover.guide_h3')}</li>
                                </ul>
                                <span className="discover-card-cta">
                                    {t('discover.guide_cta')} <i className="fas fa-arrow-right"></i>
                                </span>
                            </div>
                        </a>

                        {/* Itineraires Card */}
                        <a href={`/${locale}/itineraires`} className="discover-card discover-card-dark">
                            <div className="discover-card-visual">
                                <span className="discover-card-emoji">🏜️</span>
                                <div className="discover-card-badge">
                                    <i className="fas fa-route"></i>
                                </div>
                            </div>
                            <div className="discover-card-body">
                                <h3>{t('discover.itin_title')}</h3>
                                <p className="discover-card-desc">{t('discover.itin_desc')}</p>
                                <ul className="discover-card-highlights">
                                    <li><i className="fas fa-wind"></i> {t('discover.itin_h1')}</li>
                                    <li><i className="fas fa-mountain"></i> {t('discover.itin_h2')}</li>
                                    <li><i className="fas fa-water"></i> {t('discover.itin_h3')}</li>
                                </ul>
                                <span className="discover-card-cta">
                                    {t('discover.itin_cta')} <i className="fas fa-arrow-right"></i>
                                </span>
                            </div>
                        </a>

                    </div>
                </section>
            </ScrollReveal>

            {/* New Reviews Section */}
            <ScrollReveal>
                <ReviewsSection />
            </ScrollReveal>
        </>
    );
}