'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '@/lib/auth';

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
            { folder: `bouderba-rental/${folderName}` },
            (error, result) => {
                if (error || !result) reject("Échec Cloudinary");
                else resolve(result.secure_url);
            }
        );
        uploadStream.end(buffer);
    });
}

export async function getSettings() {
    return await prisma.setting.findUnique({ where: { id: 1 } });
}

export async function updateSettings(formData: FormData) {
    await requireAuth();
    const phoneNumber = formData.get('phoneNumber') as string;
    const phoneNumber2 = formData.get('phoneNumber2') as string | null;
    const logoFile = formData.get('logo') as File | null;
    
    // Heures d'ouverture
    const hoursMonday = formData.get('hoursMonday') as string | null;
    const hoursTuesday = formData.get('hoursTuesday') as string | null;
    const hoursWednesday = formData.get('hoursWednesday') as string | null;
    const hoursThursday = formData.get('hoursThursday') as string | null;
    const hoursFriday = formData.get('hoursFriday') as string | null;
    const hoursSaturday = formData.get('hoursSaturday') as string | null;
    const hoursSunday = formData.get('hoursSunday') as string | null;

    const currentSettings = await prisma.setting.findUnique({ where: { id: 1 } });
    let logoUrl = currentSettings?.logoUrl;

    if (logoFile && logoFile.size > 0) {
        // Optionnel : supprimer l'ancien logo sur Cloudinary ici si nécessaire
        logoUrl = await uploadToCloudinary(logoFile, 'config');
    }

    await prisma.setting.upsert({
        where: { id: 1 },
        update: { 
            phoneNumber, phoneNumber2, logoUrl,
            hoursMonday, hoursTuesday, hoursWednesday, hoursThursday, 
            hoursFriday, hoursSaturday, hoursSunday 
        },
        create: { 
            id: 1, phoneNumber, phoneNumber2, logoUrl,
            hoursMonday, hoursTuesday, hoursWednesday, hoursThursday, 
            hoursFriday, hoursSaturday, hoursSunday 
        },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/admin/settings');
}