'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';

const DATA_FILE = path.join(process.cwd(), 'data', 'services.json');

interface ServiceItem {
    id: number;
    icon: string;
    title: string;
    title_en?: string;
    title_es?: string;
    title_ar?: string;
    title_ma?: string;
    description: string;
    description_en?: string;
    description_es?: string;
    description_ar?: string;
    description_ma?: string;
}

async function getServices(): Promise<ServiceItem[]> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveServices(services: ServiceItem[]) {
    await fs.writeFile(DATA_FILE, JSON.stringify(services, null, 2), 'utf-8');
}

export async function createService(formData: FormData) {
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
    const icon = formData.get('icon') as string;

    const services = await getServices();
    const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;

    const newService: ServiceItem = {
        id: newId,
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
    };

    services.push(newService);
    await saveServices(services);

    revalidatePath('/admin/services');
    revalidatePath('/');
    revalidatePath('/admin/services');
    revalidatePath('/');
}

export async function updateService(id: number, formData: FormData) {
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
    const icon = formData.get('icon') as string;

    let services = await getServices();
    const index = services.findIndex(s => s.id === id);

    if (index !== -1) {
        services[index] = { ...services[index], title, title_en, title_es, title_ar, title_ma, description, description_en, description_es, description_ar, description_ma, icon };
        await saveServices(services);

        revalidatePath('/admin/services');
        revalidatePath('/');
    }
}

export async function deleteService(id: number) {
    await requireAuth();
    let services = await getServices();
    services = services.filter(s => s.id !== id);
    await saveServices(services);

    revalidatePath('/admin/services');
    revalidatePath('/');
}
