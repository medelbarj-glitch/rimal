export const dynamic = 'force-dynamic';

import React from 'react';

// Importation des polices et bibliothèques
import { prisma } from '../lib/prisma'; // Connexion à la BDD
import { ImageSlider } from './components/ImageSlider';
import { BackgroundImage, ModeleVoiture } from '@prisma/client';
import { NavbarAndMenu } from './components/Menu';
import { VehiclesSection } from './components/VehiclesSection';
import { ReservationForm } from './components/ReservationForm';
import { ServicesSection } from './components/ServicesSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ScrollReveal } from './components/ScrollReveal';

const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00"
];

export default async function Home() {
    // 2. RÉCUPÉRER LES IMAGES DU SLIDER DEPUIS LA BDD
    // Je suppose que votre modèle s'appelle 'backgroundImage'
    const sliderImagesFromDb = await prisma.backgroundImage.findMany({
        // Vous pouvez ajouter un 'orderBy' si vous voulez
        orderBy: {
            createdAt: 'asc', // Par exemple, pour les avoir dans l'ordre de création
        },
    });

    // 3. TRANSFORMER les données de la BDD
    // Le slider attend { src, title, subtitle }
    // La BDD donne { url, name, ... } (je suppose 'name' pour le titre)
    const sliderData = sliderImagesFromDb.map((image: BackgroundImage) => ({
        src: image.url,
        title: image.name, // ou 'image.title' si vous avez ce champ
        subtitle: image.subtitle || '', // Ajoutez un champ subtitle à votre BDD ou mettez une valeur par défaut
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
    return (
        <>
            <NavbarAndMenu voitures={voitures} locations={locations} />

            {/* Slider doesn't need reveal usually, or can be separate */}
            <ImageSlider images={sliderData} interval={5000} />

            <ScrollReveal delay="delay-100" className="reservation-wrapper-fix">
                <ReservationForm locations={locations} hours={timeSlots} />
            </ScrollReveal>

            {/* New Services Section */}
            <ScrollReveal>
                <ServicesSection services={servicesData} />
            </ScrollReveal>

            <ScrollReveal>
                <h1 className="vehicules-title">Nos Véhicules</h1>
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