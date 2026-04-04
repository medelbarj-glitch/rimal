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
                if (error || !result) {
                    console.error("Erreur Cloudinary:", error);
                    reject("Échec de l'upload de l'image");
                } else {
                    resolve(result.secure_url);
                }
            }
        );
        uploadStream.end(buffer);
    });
}

async function deleteFromCloudinary(imageUrl: string | null) {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) return;
    try {
        const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
        if (matches && matches[1]) {
            const publicId = matches[1];
            await cloudinary.uploader.destroy(publicId);
        }
    } catch (error) {
        console.error("Erreur lors de la suppression Cloudinary:", error);
    }
}

export async function createBackgroundImage(formData: FormData) {
    await requireAuth();
    const name = formData.get('name') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const imageFile = formData.get('imageFile') as File | null;

    if (!imageFile || imageFile.size === 0) {
        throw new Error("Une image est requise.");
    }

    const url = await uploadToCloudinary(imageFile, 'styles');

    await prisma.backgroundImage.create({
        data: {
            name,
            url, // Stocke l'URL Cloudinary sécurisée
            title,
            subtitle,
        },
    });

    revalidatePath('/admin/style');
    revalidatePath('/');
}

export async function updateBackgroundImage(id: number, formData: FormData) {
    await requireAuth();
    const name = formData.get('name') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const imageFile = formData.get('imageFile') as File | null;

    const updateData: any = { name, title, subtitle };

    if (imageFile && imageFile.size > 0) {
        const oldImage = await prisma.backgroundImage.findUnique({ where: { id } });
        
        const newUrl = await uploadToCloudinary(imageFile, 'styles');
        updateData.url = newUrl;

        if (oldImage?.url) {
            await deleteFromCloudinary(oldImage.url);
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
    await requireAuth();
    const imageToDelete = await prisma.backgroundImage.findUnique({
        where: { id },
    });

    if (imageToDelete) {
        await deleteFromCloudinary(imageToDelete.url);
        await prisma.backgroundImage.delete({
            where: { id },
        });
    }

    revalidatePath('/admin/style');
    revalidatePath('/');
}