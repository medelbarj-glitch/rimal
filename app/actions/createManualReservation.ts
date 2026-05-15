'use server';

import { prisma } from '@/lib/prisma';
import { StatusReservation } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createManualReservation(data: {
    vehiculeId: number;
    dateDebut: Date;
    dateFin: Date;
    lieuPriseEnChargeId: number | null;
    lieuRetourId: number | null;
    customPriseEnCharge: string | null;
    customRetour: string | null;
    prixTotal: number;
    clientNom: string;
    clientPrenom: string;
    clientEmail: string;
    clientTel: string;
    status: string;
    note: string | null;
    options?: { optionId: number; quantite: number; prixUnitaire: number }[];
}) {
    try {
        const {
            vehiculeId,
            dateDebut,
            dateFin,
            lieuPriseEnChargeId,
            lieuRetourId,
            customPriseEnCharge,
            customRetour,
            prixTotal,
            clientNom,
            clientPrenom,
            clientEmail,
            clientTel,
            status,
            note
        } = data;
        const options = data.options || [];

        if (!vehiculeId || !dateDebut || !dateFin || !clientNom || !clientPrenom || !clientTel) {
            return { success: false, error: 'Les champs obligatoires ne sont pas remplis.' };
        }

        if (dateFin <= dateDebut) {
            return { success: false, error: 'La date de fin doit être ultérieure à la date de début.' };
        }

        const reservation = await prisma.reservation.create({
            data: {
                vehiculeId,
                dateDebut,
                dateFin,
                lieuPriseEnChargeId,
                lieuRetourId,
                customPriseEnCharge: customPriseEnCharge || undefined,
                customRetour: customRetour || undefined,
                prixTotal,
                clientNom,
                clientPrenom,
                clientEmail: clientEmail || 'Non renseigné',
                clientTel,
                status: status as StatusReservation,
                note: note || undefined,
                options: options.length > 0 ? {
                    create: options.map(o => ({
                        optionId: o.optionId,
                        quantite: o.quantite,
                        prixUnitaire: o.prixUnitaire,
                    }))
                } : undefined,
            }
        });

        revalidatePath('/admin/reservations');
        revalidatePath('/admin/planning');

        return { success: true, reservation };
    } catch (error: any) {
        console.error('Error creating manual reservation:', error);
        return { success: false, error: error.message || 'Une erreur est survenue lors de la création de la réservation.' };
    }
}
