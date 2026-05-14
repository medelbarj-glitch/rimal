'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addPrixSaisonnier(data: {
    modeleId: number;
    nom: string;
    dateDebut: Date;
    dateFin: Date;
    prixParJour: number;
}) {
    try {
        const { modeleId, nom, dateDebut, dateFin, prixParJour } = data;

        if (!modeleId || !dateDebut || !dateFin || !prixParJour) {
            return { success: false, error: 'Les champs obligatoires ne sont pas remplis.' };
        }

        if (new Date(dateFin) <= new Date(dateDebut)) {
            return { success: false, error: 'La date de fin doit être ultérieure à la date de début.' };
        }

        const prixSaisonnier = await prisma.prixSaisonnier.create({
            data: {
                modeleId,
                nom,
                dateDebut: new Date(dateDebut),
                dateFin: new Date(dateFin),
                prixParJour: Number(prixParJour)
            }
        });

        revalidatePath('/admin/pricing');
        // Revalidate the frontend paths that use pricing
        revalidatePath('/[locale]/vehicule/[id]', 'page');
        revalidatePath('/[locale]/vehicles/[id]', 'page');
        revalidatePath('/', 'page'); // Homepage sections

        return { success: true, prixSaisonnier };
    } catch (error: any) {
        console.error('Error adding seasonal price:', error);
        return { success: false, error: error.message || 'Une erreur est survenue.' };
    }
}

export async function deletePrixSaisonnier(id: number) {
    try {
        await prisma.prixSaisonnier.delete({
            where: { id }
        });

        revalidatePath('/admin/pricing');
        revalidatePath('/[locale]/vehicule/[id]', 'page');
        revalidatePath('/[locale]/vehicles/[id]', 'page');
        revalidatePath('/', 'page');

        return { success: true };
    } catch (error: any) {
        console.error('Error deleting seasonal price:', error);
        return { success: false, error: error.message || 'Une erreur est survenue.' };
    }
}

export async function updatePromotion(data: {
    modeleId: number;
    promotionActive: boolean;
    promotionDateDebut: Date | null;
    promotionDateFin: Date | null;
    promotionPrixParJour: number | null;
}) {
    try {
        const { modeleId, promotionActive, promotionDateDebut, promotionDateFin, promotionPrixParJour } = data;

        if (!modeleId) {
            return { success: false, error: 'Modèle ID manquant.' };
        }

        if (promotionActive && (!promotionDateDebut || !promotionDateFin || !promotionPrixParJour)) {
            return { success: false, error: 'Tous les champs de promotion doivent être remplis pour l\'activer.' };
        }

        if (promotionActive && promotionDateDebut && promotionDateFin && new Date(promotionDateFin) <= new Date(promotionDateDebut)) {
            return { success: false, error: 'La date de fin doit être ultérieure à la date de début.' };
        }

        const modele = await prisma.modeleVoiture.update({
            where: { id: modeleId },
            data: {
                promotionActive,
                promotionDateDebut: promotionDateDebut ? new Date(promotionDateDebut) : null,
                promotionDateFin: promotionDateFin ? new Date(promotionDateFin) : null,
                promotionPrixParJour: promotionPrixParJour ? Number(promotionPrixParJour) : null
            }
        });

        revalidatePath('/admin/pricing');
        revalidatePath('/[locale]/vehicule/[id]', 'page');
        revalidatePath('/[locale]/vehicles/[id]', 'page');
        revalidatePath('/', 'page');

        return { success: true, modele };
    } catch (error: any) {
        console.error('Error updating promotion:', error);
        return { success: false, error: error.message || 'Une erreur est survenue.' };
    }
}
