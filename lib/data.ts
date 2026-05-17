import { cache } from 'react';
import { prisma } from './prisma';

// Fonction mémoïsée pour récupérer les voitures avec prix saisonniers
export const getVoitures = cache(async () => {
    return await prisma.modeleVoiture.findMany({
        include: { prixSaisonniers: true }
    });
});

// Fonction mémoïsée pour récupérer les locations
export const getLocations = cache(async () => {
    return await prisma.location.findMany();
});

// Fonction mémoïsée pour récupérer les settings du site
export const getSettings = cache(async () => {
    return await prisma.setting.findUnique({
        where: { id: 1 }
    });
});
