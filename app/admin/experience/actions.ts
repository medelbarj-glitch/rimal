'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const DATA_FILE = path.join(process.cwd(), 'data', 'experience.json');

interface ExperienceItem {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    buttonText: string;
}

// --- Fonctions utilitaires pour les fichiers physiques ---
async function saveFile(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '_')}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);

    // S'assure que le dossier public/uploads existe
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filepath, buffer);

    return `/uploads/${filename}`;
}

async function deletePhysicalFile(fileUrl: string) {
    if (!fileUrl.startsWith('/uploads/')) return; // Sécurité

    const filename = fileUrl.replace('/uploads/', '');
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

    try {
        await fs.unlink(filepath);
    } catch (error) {
        console.error(`Impossible de supprimer le fichier ${filepath}:`, error);
    }
}

async function getExperience(): Promise<ExperienceItem[]> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveExperience(items: ExperienceItem[]) {
    await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

export async function createExperience(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const buttonText = formData.get('buttonText') as string;
    const imageFile = formData.get('imageFile') as File | null;

    if (!imageFile || imageFile.size === 0) {
        throw new Error("Une image est requise.");
    }

    // Sauvegarde physique de la nouvelle image
    const imageUrl = await saveFile(imageFile);

    const items = await getExperience();
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;

    const newItem: ExperienceItem = {
        id: newId,
        title,
        description,
        imageUrl, // On sauvegarde le chemin local /uploads/...
        buttonText,
    };

    items.push(newItem);
    await saveExperience(items);

    revalidatePath('/admin/style');
    revalidatePath('/');
}

export async function updateExperience(id: number, formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const buttonText = formData.get('buttonText') as string;
    const imageFile = formData.get('imageFile') as File | null;

    let items = await getExperience();
    const index = items.findIndex(i => i.id === id);

    if (index !== -1) {
        const item = items[index];
        let newImageUrl = item.imageUrl;

        // Si une nouvelle image a été uploadée pour remplacer l'ancienne
        if (imageFile && imageFile.size > 0) {
            newImageUrl = await saveFile(imageFile);
            
            // On supprime l'ancien fichier physique pour ne pas saturer le serveur
            if (item.imageUrl) {
                await deletePhysicalFile(item.imageUrl);
            }
        }

        items[index] = { ...item, title, description, imageUrl: newImageUrl, buttonText };
        await saveExperience(items);

        revalidatePath('/admin/style');
        revalidatePath('/');
    }
}

export async function deleteExperience(id: number) {
    let items = await getExperience();
    const itemToDelete = items.find(i => i.id === id);

    if (itemToDelete) {
        // 1. On supprime d'abord le fichier physique de Hostinger
        if (itemToDelete.imageUrl) {
            await deletePhysicalFile(itemToDelete.imageUrl);
        }

        // 2. On met à jour le fichier JSON
        items = items.filter(i => i.id !== id);
        await saveExperience(items);

        revalidatePath('/admin/style');
        revalidatePath('/');
    }
}