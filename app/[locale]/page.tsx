export const dynamic = 'force-dynamic';

import React from 'react';

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
    // 2. RÉCUPÉRER LES IMAGES DU SLIDER DEPUIS LA BDD
    // Je suppose que votre modèle s'appelle 'backgroundImage'
    const sliderImagesFromDb = await prisma.backgroundImage.findMany({
        // Vous pouvez ajouter un 'orderBy' si vous voulez
        orderBy: {
            createdAt: 'asc', // Par exemple, pour les avoir dans l'ordre de création
        },
    });

    const sliderData = sliderImagesFromDb.map((image: BackgroundImage) => ({
        src: image.url,
        title: getTranslatedField(image, 'title', locale) || image.name,
        subtitle: getTranslatedField(image, 'subtitle', locale) || '',
    }));

    // LOAD SERVICES FROM JSON
    let servicesData = [];
    try {
        const fs = require('fs/promises');
        const path = require('path');
        const filePath = path.join(process.cwd(), 'data', 'services.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        servicesData = JSON.parse(fileContent);
    } catch (e) {
        console.error("Error loading services", e);
    }

    // LOAD EXPERIENCE FROM DB
    const experienceData = await prisma.experience.findMany({
        orderBy: { createdAt: 'asc' }
    });

    const voitures = await prisma.modeleVoiture.findMany();
    const locations = await prisma.location.findMany();
    const settings = await prisma.setting.findUnique({ where: { id: 1 } });
    const logoUrl = settings?.logoUrl || '/default-logo.png';
    return (
        <>
            <NavbarAndMenu voitures={voitures} locations={locations} logoUrl={logoUrl} />

            {/* Slider doesn't need reveal usually, or can be separate */}
            <ImageSlider images={sliderData} interval={5000} />

            <ScrollReveal delay="delay-100" className="reservation-wrapper-fix" id="reservations">
                <ReservationForm locations={locations} hours={timeSlots} />
            </ScrollReveal>

            {/* New Services Section */}
            <ScrollReveal>
                <ServicesSection services={servicesData} />
            </ScrollReveal>

            <ScrollReveal>
                <h1 className="vehicules-title" id="vehicules">{t('vehicles.title')}</h1>
                <VehiclesSection voitures={voitures} />
            </ScrollReveal>

            {/* New Experience Section */}
            <ScrollReveal>
                <ExperienceSection experiences={experienceData} />
            </ScrollReveal>

            {/* New Reviews Section */}
            <ScrollReveal>
                <ReviewsSection />
            </ScrollReveal>
        </>
    );
}