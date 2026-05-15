'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function createService(formData: FormData) {
    await requireAuth();
    const title = formData.get('title') as string;
    const title_en = (formData.get('title_en') as string) || null;
    const title_es = (formData.get('title_es') as string) || null;
    const title_ar = (formData.get('title_ar') as string) || null;
    const title_ma = (formData.get('title_ma') as string) || null;
    const description = formData.get('description') as string;
    const description_en = (formData.get('description_en') as string) || null;
    const description_es = (formData.get('description_es') as string) || null;
    const description_ar = (formData.get('description_ar') as string) || null;
    const description_ma = (formData.get('description_ma') as string) || null;
    const icon = formData.get('icon') as string;

    // Get the highest current order to append at the end
    const maxOrder = await prisma.service.aggregate({ _max: { ordre: true } });
    const nextOrder = (maxOrder._max.ordre ?? -1) + 1;

    await prisma.service.create({
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
            icon,
            ordre: nextOrder,
        },
    });

    revalidatePath('/admin/style');
    revalidatePath('/');
}

export async function updateService(id: number, formData: FormData) {
    await requireAuth();
    const title = formData.get('title') as string;
    const title_en = (formData.get('title_en') as string) || null;
    const title_es = (formData.get('title_es') as string) || null;
    const title_ar = (formData.get('title_ar') as string) || null;
    const title_ma = (formData.get('title_ma') as string) || null;
    const description = formData.get('description') as string;
    const description_en = (formData.get('description_en') as string) || null;
    const description_es = (formData.get('description_es') as string) || null;
    const description_ar = (formData.get('description_ar') as string) || null;
    const description_ma = (formData.get('description_ma') as string) || null;
    const icon = formData.get('icon') as string;

    await prisma.service.update({
        where: { id },
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
            icon,
        },
    });

    revalidatePath('/admin/style');
    revalidatePath('/');
}

export async function deleteService(id: number) {
    await requireAuth();
    await prisma.service.delete({ where: { id } });

    revalidatePath('/admin/style');
    revalidatePath('/');
}
