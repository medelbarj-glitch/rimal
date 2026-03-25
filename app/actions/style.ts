'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';

// Fonction utilitaire pour sauvegarder un fichier
async function saveFile(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '_')}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);

    // S'assure que le dossier public/uploads existe
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filepath, buffer);

    return `/uploads/${filename}`;
}

// Fonction utilitaire pour supprimer un fichier physique
async function deletePhysicalFile(fileUrl: string) {
    if (!fileUrl.startsWith('/uploads/')) return; // Ne supprime pas si c'est un lien externe accidentel

    const filename = fileUrl.replace('/uploads/', '');
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

    try {
        await unlink(filepath);
    } catch (error) {
        console.error(`Impossible de supprimer le fichier ${filepath}:`, error);
        // On ne bloque pas l'exécution si le fichier est déjà introuvable
    }
}

export async function createBackgroundImage(formData: FormData) {
    const name = formData.get('name') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const imageFile = formData.get('imageFile') as File | null;

    if (!imageFile || imageFile.size === 0) {
        throw new Error("Une image est requise.");
    }

    // Sauvegarde physique et récupération du chemin
    const url = await saveFile(imageFile);

    await prisma.backgroundImage.create({
        data: {
            name,
            url, // On stocke le chemin local (/uploads/...)
            title,
            subtitle,
        },
    });

    revalidatePath('/admin/style');
    revalidatePath('/');
}

export async function updateBackgroundImage(id: number, formData: FormData) {
    const name = formData.get('name') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const imageFile = formData.get('imageFile') as File | null;

    // On prépare les données à mettre à jour
    const updateData: any = { name, title, subtitle };

    // Si un nouveau fichier a été uploadé, on doit le traiter
    if (imageFile && imageFile.size > 0) {
        // 1. On récupère l'ancienne image pour pouvoir la supprimer
        const oldImage = await prisma.backgroundImage.findUnique({ where: { id } });
        
        // 2. On sauvegarde la nouvelle image
        const newUrl = await saveFile(imageFile);
        updateData.url = newUrl;

        // 3. On supprime l'ancien fichier physique
        if (oldImage?.url) {
            await deletePhysicalFile(oldImage.url);
        }
    }

    await prisma.backgroundImage.update({
        where: { id },
        data: updateData,
    });

    revalidatePath('/admin/style');
    revalidatePath('/');
}

export async function deleteBackgroundImage(id: number) {
    // 1. On récupère les infos de l'image avant de la supprimer de la base
    const imageToDelete = await prisma.backgroundImage.findUnique({
        where: { id },
    });

    if (imageToDelete) {
        // 2. On supprime l'entrée dans la base de données
        await prisma.backgroundImage.delete({
            where: { id },
        });

        // 3. On supprime le fichier physique du serveur
        if (imageToDelete.url) {
            await deletePhysicalFile(imageToDelete.url);
        }
    }

    revalidatePath('/admin/style');
    revalidatePath('/');
}