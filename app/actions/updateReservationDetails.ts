'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';

interface ReservationUpdateData {
    dateDebut: Date;
    dateFin: Date;
    lieuPriseEnChargeId: number | null;
    lieuRetourId: number | null;
    customPriseEnCharge?: string | null;
    customRetour?: string | null;
    prixTotal: number;
    note?: string | null;
    vehiculeId: number;
}

export async function updateReservationDetails(id: number, data: ReservationUpdateData) {
    await requireAuth();
    try {
        const now = new Date();
        now.setSeconds(0, 0);

        if (data.dateDebut < now) {
            // ... existing checks ...
        }

        if (data.dateFin <= data.dateDebut) {
            return { success: false, error: 'La date de retour doit être après la date de début' };
        }

        await prisma.reservation.update({
            where: { id },
            data: {
                dateFin: data.dateFin,
                lieuPriseEnChargeId: data.lieuPriseEnChargeId || null, // Convert 0 to null safety check
                lieuRetourId: data.lieuRetourId || null,
                customPriseEnCharge: data.customPriseEnCharge,
                customRetour: data.customRetour,
                prixTotal: data.prixTotal,
                note: data.note,
                vehiculeId: data.vehiculeId,
            },
        });

        revalidatePath('/admin/reservations');
        return { success: true };
    } catch (error) {
        console.error('Failed to update reservation details:', error);
        return { success: false, error: 'Failed to update details' };
    }
}
