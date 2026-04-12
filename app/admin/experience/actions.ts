'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '@/lib/auth';

// Configuration Cloudinary
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
                    reject("Échec de l'upload");
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
            await cloudinary.uploader.destroy(matches[1]);
        }
    } catch (error) {
        console.error("Erreur Cloudinary:", error);
    }
}

export async function createExperience(formData: FormData) {
    await requireAuth();
    const title = formData.get('title') as string;
    const title_en = formData.get('title_en') as string;
    const title_es = formData.get('title_es') as string;
    const title_ar = formData.get('title_ar') as string;
    const title_ma = formData.get('title_ma') as string;
    const description = formData.get('description') as string;
    const description_en = formData.get('description_en') as string;
    const description_es = formData.get('description_es') as string;
    const description_ar = formData.get('description_ar') as string;
    const description_ma = formData.get('description_ma') as string;
    const buttonText = formData.get('buttonText') as string;
    const buttonText_en = formData.get('buttonText_en') as string;
    const buttonText_es = formData.get('buttonText_es') as string;
    const buttonText_ar = formData.get('buttonText_ar') as string;
    const buttonText_ma = formData.get('buttonText_ma') as string;
    const imageFile = formData.get('imageFile') as File | null;

    let imageUrl: string | undefined = undefined;
    if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadToCloudinary(imageFile, 'experiences');
    }

    await prisma.experience.create({
        data: {
            title,
            title_en,
            title_es,
            title_ar,
            title_ma,
            description,
            description_en,
            description_es,
            description_ar,
            description_ma,
            imageUrl,
            buttonText,
            buttonText_en,
            buttonText_es,
            buttonText_ar,
            buttonText_ma,
        },
    });

    revalidatePath('/admin/style');
    revalidatePath('/');
}

export async function updateExperience(id: number, formData: FormData) {
    await requireAuth();
    const title = formData.get('title') as string;
    const title_en = formData.get('title_en') as string;
    const title_es = formData.get('title_es') as string;
    const title_ar = formData.get('title_ar') as string;
    const title_ma = formData.get('title_ma') as string;
    const description = formData.get('description') as string;
    const description_en = formData.get('description_en') as string;
    const description_es = formData.get('description_es') as string;
    const description_ar = formData.get('description_ar') as string;
    const description_ma = formData.get('description_ma') as string;
    const buttonText = formData.get('buttonText') as string;
    const buttonText_en = formData.get('buttonText_en') as string;
    const buttonText_es = formData.get('buttonText_es') as string;
    const buttonText_ar = formData.get('buttonText_ar') as string;
    const buttonText_ma = formData.get('buttonText_ma') as string;
    const imageFile = formData.get('imageFile') as File | null;

    const updateData: any = { 
        title, 
        title_en,
        title_es,
        title_ar,
        title_ma,
        description, 
        description_en,
        description_es,
        description_ar,
        description_ma,
        buttonText,
        buttonText_en,
        buttonText_es,
        buttonText_ar,
        buttonText_ma
    };

    if (imageFile && imageFile.size > 0) {
        const oldExp = await prisma.experience.findUnique({ where: { id } });

        const newUrl = await uploadToCloudinary(imageFile, 'experiences');
        updateData.imageUrl = newUrl;

        if (oldExp?.imageUrl) {
            await deleteFromCloudinary(oldExp.imageUrl);
        }
    }

    await prisma.experience.update({
        where: { id },
        data: updateData,
    });

    revalidatePath('/admin/style');
    revalidatePath('/');
}

export async function deleteExperience(id: number) {
    await requireAuth();
    const expToDelete = await prisma.experience.findUnique({ where: { id } });

    if (expToDelete) {
        await deleteFromCloudinary(expToDelete.imageUrl);
        await prisma.experience.delete({ where: { id } });
    }

    revalidatePath('/admin/style');
    revalidatePath('/');
}