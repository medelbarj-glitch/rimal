'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function createOption(formData: FormData) {
    await requireAuth();
    
    const nom = formData.get('nom') as string;
    const nom_en = formData.get('nom_en') as string;
    const nom_es = formData.get('nom_es') as string;
    const nom_ar = formData.get('nom_ar') as string;
    const nom_ma = formData.get('nom_ma') as string;
    const prix = parseInt(formData.get('prix') as string);
    const icon = (formData.get('icon') as string) || 'fa-star';
    const perDay = formData.get('perDay') === 'true';
    const maxQuantite = parseInt(formData.get('maxQuantite') as string) || 1;

    if (!nom || isNaN(prix)) {
        return { success: false, error: 'Le nom et le prix sont requis.' };
    }

    try {
        await prisma.optionReservation.create({
            data: {
                nom,
                nom_en: nom_en || null,
                nom_es: nom_es || null,
                nom_ar: nom_ar || null,
                nom_ma: nom_ma || null,
                prix,
                icon,
                perDay,
                maxQuantite,
            },
        });

        revalidatePath('/admin/options');
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        console.error('Error creating option:', error);
        return { success: false, error: error.message || 'Erreur lors de la création.' };
    }
}

export async function updateOption(id: number, formData: FormData) {
    await requireAuth();

    const nom = formData.get('nom') as string;
    const nom_en = formData.get('nom_en') as string;
    const nom_es = formData.get('nom_es') as string;
    const nom_ar = formData.get('nom_ar') as string;
    const nom_ma = formData.get('nom_ma') as string;
    const prix = parseInt(formData.get('prix') as string);
    const icon = (formData.get('icon') as string) || 'fa-star';
    const perDay = formData.get('perDay') === 'true';
    const maxQuantite = parseInt(formData.get('maxQuantite') as string) || 1;

    if (!nom || isNaN(prix)) {
        return { success: false, error: 'Le nom et le prix sont requis.' };
    }

    try {
        await prisma.optionReservation.update({
            where: { id },
            data: {
                nom,
                nom_en: nom_en || null,
                nom_es: nom_es || null,
                nom_ar: nom_ar || null,
                nom_ma: nom_ma || null,
                prix,
                icon,
                perDay,
                maxQuantite,
            },
        });

        revalidatePath('/admin/options');
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating option:', error);
        return { success: false, error: error.message || 'Erreur lors de la mise à jour.' };
    }
}

export async function toggleOptionActive(id: number) {
    await requireAuth();

    try {
        const option = await prisma.optionReservation.findUnique({ where: { id } });
        if (!option) return { success: false, error: 'Option introuvable.' };

        await prisma.optionReservation.update({
            where: { id },
            data: { actif: !option.actif },
        });

        revalidatePath('/admin/options');
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        console.error('Error toggling option:', error);
        return { success: false, error: error.message || 'Erreur lors du changement de statut.' };
    }
}

export async function deleteOption(id: number) {
    await requireAuth();

    try {
        await prisma.optionReservation.delete({
            where: { id },
        });

        revalidatePath('/admin/options');
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting option:', error);
        return { success: false, error: error.message || 'Erreur lors de la suppression.' };
    }
}
