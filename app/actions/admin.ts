'use server';

import { PrismaClient, Transmission, FuelType, StatutVehicule } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '@/lib/auth';

const prisma = new PrismaClient();

// Configuration de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(file: File, folderName: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                folder: `bouderba-rental/${folderName}`, // Crée un dossier propre sur ton Cloudinary
            },
            (error, result) => {
                if (error || !result) {
                    console.error("Erreur Cloudinary:", error);
                    reject("Échec de l'upload de l'image");
                } else {
                    // On retourne l'URL sécurisée fournie par Cloudinary
                    resolve(result.secure_url);
                }
            }
        );

        uploadStream.end(buffer);
    });
}

async function deleteFromCloudinary(imageUrl: string | null) {
    // Si pas d'image ou si ce n'est pas une image Cloudinary, on arrête
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) return;

    try {
        // L'URL Cloudinary ressemble à :
        // https://res.cloudinary.com/xyz/image/upload/v12345/bouderba-rental/vehicles/mon_image.jpg
        // Cette regex extrait exactement : "bouderba-rental/vehicles/mon_image"
        const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
        
        if (matches && matches[1]) {
            const publicId = matches[1];
            await cloudinary.uploader.destroy(publicId);
        }
    } catch (error) {
        console.error("Erreur lors de la suppression Cloudinary:", error);
    }
}

// --- MODEL ACTIONS ---

export async function createModel(formData: FormData) {
    await requireAuth();
    const nom = formData.get('nom') as string;
    const prixParJour = parseFloat(formData.get('prixParJour') as string);
    const nbPlaces = parseInt(formData.get('nbPlaces') as string);
    const transmission = formData.get('transmission') as any;
    const fuelType = formData.get('fuelType') as any;
    const description = formData.get('description') as string;
    const description_en = formData.get('description_en') as string;
    const description_es = formData.get('description_es') as string;
    const description_ar = formData.get('description_ar') as string;
    const description_ma = formData.get('description_ma') as string;
    
    // Récupération du fichier
    const imageFile = formData.get('imageFile') as File | null;

    // Récupération des fichiers de la galerie
    const galleryFiles = formData.getAll('galleryFiles') as File[];

    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadToCloudinary(imageFile, 'vehicles');
    }

    const nouveauModele = await prisma.modeleVoiture.create({
        data: {
            nom,
            prixParJour,
            nbPlaces,
            transmission,
            fuelType,
            description,
            description_en,
            description_es,
            description_ar,
            description_ma,
            imageUrl, // Stocke l'URL Cloudinary sécurisée principale
        },
    });

    // Upload et création des images de la galerie
    if (galleryFiles && galleryFiles.length > 0) {
        const galleryUploads = galleryFiles.filter(file => file.size > 0);
        for (const file of galleryUploads) {
            const galleryUrl = await uploadToCloudinary(file, 'vehicles/gallery');
            await prisma.modeleImage.create({
                data: {
                    url: galleryUrl,
                    modeleId: nouveauModele.id
                }
            });
        }
    }

    revalidatePath('/admin/vehicles');
    revalidatePath('/', 'layout');
}

export async function updateModel(id: number, formData: FormData) {
    await requireAuth();
    const nom = formData.get('nom') as string;
    const prixParJour = parseFloat(formData.get('prixParJour') as string);
    const nbPlaces = parseInt(formData.get('nbPlaces') as string);
    const transmission = formData.get('transmission') as any;
    const fuelType = formData.get('fuelType') as any;
    const description = formData.get('description') as string;
    const description_en = formData.get('description_en') as string;
    const description_es = formData.get('description_es') as string;
    const description_ar = formData.get('description_ar') as string;
    const description_ma = formData.get('description_ma') as string;
    
    // Récupération du fichier
    const imageFile = formData.get('imageFile') as File | null;

    // Récupération des fichiers de la galerie
    const galleryFiles = formData.getAll('galleryFiles') as File[];

    const updateData: any = {
        nom,
        prixParJour,
        nbPlaces,
        transmission,
        fuelType,
        description,
        description_en,
        description_es,
        description_ar,
        description_ma,
    };

    // Gestion du remplacement de l'image principale
    if (imageFile && imageFile.size > 0) {
        const oldModel = await prisma.modeleVoiture.findUnique({ where: { id } });
        
        const newImageUrl = await uploadToCloudinary(imageFile, 'vehicles');
        updateData.imageUrl = newImageUrl;

        if (oldModel?.imageUrl) {
            await deleteFromCloudinary(oldModel.imageUrl);
        }
    }

    await prisma.modeleVoiture.update({
        where: { id },
        data: updateData,
    });

    // Upload et création des images de la galerie
    if (galleryFiles && galleryFiles.length > 0) {
        const galleryUploads = galleryFiles.filter(file => file.size > 0);
        for (const file of galleryUploads) {
            const galleryUrl = await uploadToCloudinary(file, 'vehicles/gallery');
            await prisma.modeleImage.create({
                data: {
                    url: galleryUrl,
                    modeleId: id
                }
            });
        }
    }

    revalidatePath(`/admin/vehicles/${id}`);
    revalidatePath('/admin/vehicles');
    revalidatePath('/', 'layout');
}

export async function deleteModel(id: number) {
    await requireAuth();
    const modelToDelete = await prisma.modeleVoiture.findUnique({
        where: { id },
    });

    if (modelToDelete) {
        // Supprime l'image principale
        await deleteFromCloudinary(modelToDelete.imageUrl);

        // Supprime les images de la galerie sur Cloudinary
        const imagesToDelete = await prisma.modeleImage.findMany({ where: { modeleId: id } });
        for (const img of imagesToDelete) {
            await deleteFromCloudinary(img.url);
        }

        // Note : La suppression en base des modeleImage se fait par cascade (onDelete: Cascade)
        await prisma.modeleVoiture.delete({
            where: { id },
        });
    }

    revalidatePath('/admin/vehicles');
    revalidatePath('/', 'layout');
}

export async function deleteGalleryImage(imageId: number) {
    await requireAuth();
    
    const imageToDelete = await prisma.modeleImage.findUnique({
        where: { id: imageId }
    });

    if (imageToDelete) {
        await deleteFromCloudinary(imageToDelete.url);
        await prisma.modeleImage.delete({
            where: { id: imageId }
        });
        
        revalidatePath(`/admin/vehicles/${imageToDelete.modeleId}`);
        revalidatePath('/admin/vehicles');
        revalidatePath('/', 'layout');
    }
}

// --- VEHICLE ACTIONS ---

export async function createVehicle(formData: FormData) {
    await requireAuth();
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
    await requireAuth();
    await prisma.vehicule.update({
        where: { id },
        data: { statut },
    });
    revalidatePath('/admin/vehicles');
    revalidatePath('/', 'layout');
}

export async function deleteVehicle(id: number) {
    await requireAuth();
    await prisma.vehicule.delete({
        where: { id },
    });
    revalidatePath('/admin/vehicles');
    revalidatePath('/', 'layout');
}

// --- LOCATION ACTIONS ---
export async function createLocation(formData: FormData) {
    await requireAuth();
    const nom = formData.get('nom') as string;
    const nom_en = formData.get('nom_en') as string;
    const nom_es = formData.get('nom_es') as string;
    const nom_ar = formData.get('nom_ar') as string;
    const nom_ma = formData.get('nom_ma') as string;
    const adresse = formData.get('adresse') as string;
    const fraisSupplementaires = parseInt(formData.get('fraisSupplementaires') as string || '0');
    
    // Récupération du fichier au lieu du texte
    const imageFile = formData.get('imageFile') as File | null;

    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadToCloudinary(imageFile, 'locations');
    }

    await prisma.location.create({
        data: {
            nom,
            nom_en,
            nom_es,
            nom_ar,
            nom_ma,
            adresse,
            fraisSupplementaires,
            imageUrl,
        },
    });

    revalidatePath('/admin/locations');
    revalidatePath('/', 'layout');
}

export async function updateLocation(id: number, formData: FormData) {
    await requireAuth();
    const nom = formData.get('nom') as string;
    const nom_en = formData.get('nom_en') as string;
    const nom_es = formData.get('nom_es') as string;
    const nom_ar = formData.get('nom_ar') as string;
    const nom_ma = formData.get('nom_ma') as string;
    const adresse = formData.get('adresse') as string;
    const fraisSupplementaires = parseInt(formData.get('fraisSupplementaires') as string || '0');
    
    // Récupération du fichier
    const imageFile = formData.get('imageFile') as File | null;

    const updateData: any = {
        nom,
        nom_en,
        nom_es,
        nom_ar,
        nom_ma,
        adresse,
        fraisSupplementaires,
    };

    // Gestion de la nouvelle image
    if (imageFile && imageFile.size > 0) {
        const oldLocation = await prisma.location.findUnique({ where: { id } });
        
        const newImageUrl = await uploadToCloudinary(imageFile, 'locations');
        updateData.imageUrl = newImageUrl;

        if (oldLocation?.imageUrl) {
            await deleteFromCloudinary(oldLocation.imageUrl);
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
    await requireAuth();
    const locationToDelete = await prisma.location.findUnique({
        where: { id },
    });

    if (locationToDelete) {
        // 1. Supprime d'abord l'image du serveur
        await deleteFromCloudinary(locationToDelete.imageUrl);

        // 2. Supprime l'entrée dans la base de données
        await prisma.location.delete({
            where: { id },
        });
    }
    
    revalidatePath('/admin/locations');
    revalidatePath('/', 'layout');
}