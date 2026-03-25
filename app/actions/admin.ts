'use server';

import { PrismaClient, Transmission, FuelType, StatutVehicule } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// --- Fonctions utilitaires pour les images des véhicules ---
async function saveVehicleImage(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '_')}`;
    
    // NOUVEAU DOSSIER : public/vehicles
    const uploadDir = path.join(process.cwd(), 'public', 'vehicles');
    const filepath = path.join(uploadDir, filename);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filepath, buffer);

    return `/vehicles/${filename}`;
}

async function deleteVehicleImage(fileUrl: string | null) {
    if (!fileUrl || !fileUrl.startsWith('/vehicles/')) return;

    const filename = fileUrl.replace('/vehicles/', '');
    const filepath = path.join(process.cwd(), 'public', 'vehicles', filename);

    try {
        await unlink(filepath);
    } catch (error) {
        console.error(`Impossible de supprimer l'image du véhicule ${filepath}:`, error);
    }
}

// --- MODEL ACTIONS ---

export async function createModel(formData: FormData) {
    const nom = formData.get('nom') as string;
    const prixParJour = parseFloat(formData.get('prixParJour') as string);
    const nbPlaces = parseInt(formData.get('nbPlaces') as string);
    const transmission = formData.get('transmission') as any;
    const fuelType = formData.get('fuelType') as any;
    const description = formData.get('description') as string;
    
    // Récupération du fichier
    const imageFile = formData.get('imageFile') as File | null;

    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
        imageUrl = await saveVehicleImage(imageFile);
    }

    await prisma.modeleVoiture.create({
        data: {
            nom,
            prixParJour,
            nbPlaces,
            transmission,
            fuelType,
            description,
            imageUrl, // Stocke le chemin local (/vehicles/...)
        },
    });

    revalidatePath('/admin/vehicles');
    revalidatePath('/', 'layout');
}

export async function updateModel(id: number, formData: FormData) {
    const nom = formData.get('nom') as string;
    const prixParJour = parseFloat(formData.get('prixParJour') as string);
    const nbPlaces = parseInt(formData.get('nbPlaces') as string);
    const transmission = formData.get('transmission') as any;
    const fuelType = formData.get('fuelType') as any;
    const description = formData.get('description') as string;
    
    // Récupération du fichier
    const imageFile = formData.get('imageFile') as File | null;

    const updateData: any = {
        nom,
        prixParJour,
        nbPlaces,
        transmission,
        fuelType,
        description,
    };

    // Gestion du remplacement de l'image
    if (imageFile && imageFile.size > 0) {
        const oldModel = await prisma.modeleVoiture.findUnique({ where: { id } });
        
        const newImageUrl = await saveVehicleImage(imageFile);
        updateData.imageUrl = newImageUrl;

        if (oldModel?.imageUrl) {
            await deleteVehicleImage(oldModel.imageUrl);
        }
    }

    await prisma.modeleVoiture.update({
        where: { id },
        data: updateData,
    });

    revalidatePath('/admin/vehicles');
    revalidatePath('/', 'layout');
}

export async function deleteModel(id: number) {
    const modelToDelete = await prisma.modeleVoiture.findUnique({
        where: { id },
    });

    if (modelToDelete) {
        // Supprime l'image physique avant de supprimer l'entrée DB
        await deleteVehicleImage(modelToDelete.imageUrl);

        await prisma.modeleVoiture.delete({
            where: { id },
        });
    }

    revalidatePath('/admin/vehicles');
    revalidatePath('/', 'layout');
}

// --- VEHICLE ACTIONS ---

export async function createVehicle(formData: FormData) {
    const plaque = formData.get('plaque') as string;
    const modeleId = parseInt(formData.get('modeleId') as string);
    const statut = formData.get('statut') as StatutVehicule;

    await prisma.vehicule.create({
        data: {
            plaque,
            modeleId,
            statut,
        },
    });

    revalidatePath('/admin/vehicles');
    revalidatePath('/', 'layout');
}

export async function updateVehicleStatus(id: number, statut: StatutVehicule) {
    await prisma.vehicule.update({
        where: { id },
        data: { statut },
    });
    revalidatePath('/admin/vehicles');
    revalidatePath('/', 'layout');
}

export async function deleteVehicle(id: number) {
    await prisma.vehicule.delete({
        where: { id },
    });
    revalidatePath('/admin/vehicles');
    revalidatePath('/', 'layout');
}

// --- LOCATION ACTIONS ---

// --- Fonctions utilitaires pour les images des locations ---
async function saveLocationImage(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '_')}`;
    
    // NOUVEAU DOSSIER : public/locations
    const uploadDir = path.join(process.cwd(), 'public', 'locations');
    const filepath = path.join(uploadDir, filename);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filepath, buffer);

    return `/locations/${filename}`;
}

async function deleteLocationImage(fileUrl: string | null) {
    if (!fileUrl || !fileUrl.startsWith('/locations/')) return;

    const filename = fileUrl.replace('/locations/', '');
    const filepath = path.join(process.cwd(), 'public', 'locations', filename);

    try {
        await unlink(filepath);
    } catch (error) {
        console.error(`Impossible de supprimer l'image de la location ${filepath}:`, error);
    }
}

export async function createLocation(formData: FormData) {
    const nom = formData.get('nom') as string;
    const adresse = formData.get('adresse') as string;
    const fraisSupplementaires = parseInt(formData.get('fraisSupplementaires') as string || '0');
    
    // Récupération du fichier au lieu du texte
    const imageFile = formData.get('imageFile') as File | null;

    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
        imageUrl = await saveLocationImage(imageFile);
    }

    await prisma.location.create({
        data: {
            nom,
            adresse,
            fraisSupplementaires,
            imageUrl,
        },
    });

    revalidatePath('/admin/locations');
    revalidatePath('/', 'layout');
}

export async function updateLocation(id: number, formData: FormData) {
    const nom = formData.get('nom') as string;
    const adresse = formData.get('adresse') as string;
    const fraisSupplementaires = parseInt(formData.get('fraisSupplementaires') as string || '0');
    
    // Récupération du fichier
    const imageFile = formData.get('imageFile') as File | null;

    const updateData: any = {
        nom,
        adresse,
        fraisSupplementaires,
    };

    // Gestion de la nouvelle image
    if (imageFile && imageFile.size > 0) {
        const oldLocation = await prisma.location.findUnique({ where: { id } });
        
        const newImageUrl = await saveLocationImage(imageFile);
        updateData.imageUrl = newImageUrl;

        if (oldLocation?.imageUrl) {
            await deleteLocationImage(oldLocation.imageUrl);
        }
    }

    await prisma.location.update({
        where: { id },
        data: updateData,
    });

    revalidatePath('/admin/locations');
    revalidatePath('/', 'layout');
}

export async function deleteLocation(id: number) {
    const locationToDelete = await prisma.location.findUnique({
        where: { id },
    });

    if (locationToDelete) {
        // 1. Supprime d'abord l'image du serveur
        await deleteLocationImage(locationToDelete.imageUrl);

        // 2. Supprime l'entrée dans la base de données
        await prisma.location.delete({
            where: { id },
        });
    }
    
    revalidatePath('/admin/locations');
    revalidatePath('/', 'layout');
}