'use server';

import { prisma } from '../../lib/prisma';
import { StatusReservation } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';

export async function updateReservationStatus(id: number, status: StatusReservation) {
    await requireAuth();
    try {
        const reservation = await prisma.reservation.update({
            where: { id },
            data: { status },
            include: {
                vehicule: {
                    include: { modele: true }
                },
                lieuPriseEnCharge: true,
                lieuRetour: true,
            }
        });

        // --- ENVOI D'EMAIL VIA BREVO ---
        if (status === 'CONFIRMED' || status === 'CANCELLED') {
            try {
                let pickupName = reservation.customPriseEnCharge || 'Adresse personnalisée';
                let returnName = reservation.customRetour || reservation.customPriseEnCharge || 'Adresse personnalisée';

                if (reservation.lieuPriseEnCharge) {
                    pickupName = reservation.lieuPriseEnCharge.nom;
                }
                if (reservation.lieuRetour) {
                    returnName = reservation.lieuRetour.nom;
                }

                // Format dates safely
                const startDate = new Date(reservation.dateDebut);
                const endDate = new Date(reservation.dateFin);

                const formattedStart = `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear()}`;
                const startTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;

                const formattedEnd = `${endDate.getDate().toString().padStart(2, '0')}/${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getFullYear()}`;
                const returnTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

                const firstName = reservation.clientPrenom;
                const lastName = reservation.clientNom;
                const modelNom = reservation.vehicule.modele.nom;
                const totalPrice = reservation.prixTotal;

                let emailHtml = '';
                let subject = '';

                if (status === 'CONFIRMED') {
                    subject = 'Votre réservation est confirmée - Bouderba Rental';
                    emailHtml = `
<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    <div style="background-color: #1a1a1a; padding: 25px; text-align: center; border-bottom: 4px solid #cfaa5b;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">Réservation Confirmée</h1>
    </div>
    <div style="padding: 30px; background-color: #ffffff;">
        <p style="font-size: 16px; margin-top: 0;">Bonjour <strong>${firstName} ${lastName}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.5;">Nous avons le plaisir de vous informer que votre réservation pour le véhicule <strong>${modelNom}</strong> est désormais <strong>confirmée</strong>.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #5cb85c;">
            <h2 style="font-size: 18px; margin-top: 0; color: #1a1a1a; margin-bottom: 15px;">Détails de votre réservation</h2>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 15px; line-height: 1.8;">
                <li><strong>🗓️ Du :</strong> ${formattedStart} à ${startTime}</li>
                <li><strong>🗓️ Au :</strong> ${formattedEnd} à ${returnTime}</li>
                <li><strong>📍 Prise en charge :</strong> ${pickupName}</li>
                <li><strong>📍 Retour :</strong> ${returnName}</li>
                <li><strong>💶 Montant :</strong> <span style="font-weight: bold; color: #28a745;">${totalPrice} DH</span></li>
            </ul>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5;">Nous vous attendons à la date et l'heure convenues. En cas de question concernant votre dossier, n'hésitez pas à nous contacter.</p>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            Merci de votre confiance !<br>
            <strong>L'équipe Bouderba Rental</strong>
        </p>
    </div>
</div>
                    `;
                } else if (status === 'CANCELLED') {
                    subject = 'Annulation de votre réservation - Bouderba Rental';
                    emailHtml = `
<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    <div style="background-color: #1a1a1a; padding: 25px; text-align: center; border-bottom: 4px solid #d9534f;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">Réservation Annulée</h1>
    </div>
    <div style="padding: 30px; background-color: #ffffff;">
        <p style="font-size: 16px; margin-top: 0;">Bonjour <strong>${firstName} ${lastName}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.5;">Nous vous informons que votre réservation pour le véhicule <strong>${modelNom}</strong> prévue du ${formattedStart} au ${formattedEnd} a été <strong>annulée</strong>.</p>
        
        <p style="font-size: 16px; line-height: 1.5;">Si cette annulation est intervenue par erreur ou si vous souhaitez effectuer une nouvelle réservation, nous vous invitons à visiter notre site web ou à nous contacter directement.</p>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            Cordialement,<br>
            <strong>L'équipe Bouderba Rental</strong>
        </p>
    </div>
</div>
                    `;
                }

                if (emailHtml) {
                    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json',
                            'api-key': process.env.BREVO_API_KEY || '',
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            sender: { name: 'Bouderba Rental', email: 'contact@bouderba-rental.com' },
                            to: [
                                { email: reservation.clientEmail, name: `${firstName} ${lastName}` }
                            ],
                            bcc: [
                                { email: 'contact@bouderba-rental.com', name: 'Admin Bouderba Rental' }
                            ],
                            subject: subject,
                            htmlContent: emailHtml
                        })
                    });

                    if (!response.ok) {
                        const errorInfo = await response.text();
                        console.error('Erreur API Brevo (Statut HTTP', response.status, '):', errorInfo);
                    }
                }
            } catch (err) {
                console.error('Erreur lors de l\'envoi de l\'email Brevo:', err);
            }
        }
        // --- FIN ENVOI EMAIL ---

        revalidatePath('/admin/reservations');
        return { success: true };
    } catch (error) {
        console.error('Failed to update reservation status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}