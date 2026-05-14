'use server';

import { prisma } from '../../lib/prisma';
import { redirect } from 'next/navigation';

export async function createReservation(formData: FormData) {
    const modelId = parseInt(formData.get('modelId') as string);
    // Parse inputs
    let locationId = formData.get('locationId') ? parseInt(formData.get('locationId') as string) : null;
    let returnLocationId = formData.get('returnLocationId') ? parseInt(formData.get('returnLocationId') as string) : null;

    const customLocation = formData.get('customLocation') as string;
    const customReturnLocation = formData.get('customReturnLocation') as string;

    // HARDENING: Enforce mutual exclusivity
    // If a custom location is provided, ignore the standard ID
    if (customLocation) {
        locationId = null;
    }
    if (customReturnLocation) {
        returnLocationId = null;
    }

    const startDateStr = formData.get('startDate') as string;
    const endDateStr = formData.get('endDate') as string;
    const startTime = formData.get('startTime') as string;
    const returnTime = formData.get('returnTime') as string;

    const lastName = formData.get('lastName') as string;
    const firstName = formData.get('firstName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;

    console.log('Received FormData:', Object.fromEntries(formData));
    console.log('Parsed:', { modelId, locationId, returnLocationId, customLocation });

    if (!modelId) return { error: 'Le modèle de véhicule est manquant.' };

    // CUSTOM LOGIC: Either standard location OR custom location is required
    if (!locationId && !customLocation) {
        return { error: 'Le lieu de départ est manquant. Veuillez choisir un lieu ou saisir une adresse.' };
    }

    if (!startDateStr) return { error: 'La date de départ est manquante.' };
    if (!endDateStr) return { error: 'La date de retour est manquante.' };
    if (!lastName) return { error: 'Le nom est requis.' };
    if (!firstName) return { error: 'Le prénom est requis.' };
    if (!email) return { error: 'L\'email est requis.' };
    if (!phone) return { error: 'Le téléphone est requis.' };

    // Combine date and time
    const startDateTime = new Date(`${startDateStr}T${startTime || '00:00'}:00`);
    const endDateTime = new Date(`${endDateStr}T${returnTime || '00:00'}:00`);

    const now = new Date();
    // Reset seconds/milliseconds for fair comparison
    now.setSeconds(0, 0);

    if (startDateTime < now) {
        return { error: 'La date de départ ne peut pas être dans le passé.' };
    }

    if (endDateTime <= startDateTime) {
        return { error: 'La date de retour doit être ultérieure à la date de départ.' };
    }

    // 1. Availability Check
    const availableVehicle = await prisma.vehicule.findFirst({
        where: {
            modeleId: modelId,
            statut: 'DISPONIBLE',
            reservations: {
                none: {
                    status: {
                        in: ['CONFIRMED']
                    },
                    AND: [
                        { dateDebut: { lt: endDateTime } },
                        { dateFin: { gt: startDateTime } }
                    ]
                }
            }
        }
    });

    if (!availableVehicle) {
        // Fallback: Check if ANY vehicle of this model exists, to give a better error? 
        // Or just say unavailable.
        return { error: 'Désolé, aucun véhicule de ce modèle n\'est disponible pour ces dates.' };
    }

    // Calculate price
    const model = await prisma.modeleVoiture.findUnique({ 
        where: { id: modelId },
        include: { prixSaisonniers: true }
    });
    if (!model) return { error: 'Modèle introuvable.' };

    const diffTime = Math.abs(endDateTime.getTime() - startDateTime.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let basePrice = 0;
    // Calculation day by day
    for (let i = 0; i < diffDays; i++) {
        const currentDate = new Date(startDateTime.getTime() + i * 24 * 60 * 60 * 1000);
        // Reset time for safe comparison if dates are just day-based, but since we are within range it's fine.
        const currentSeason = model.prixSaisonniers.find(s => {
            const debut = new Date(s.dateDebut);
            const fin = new Date(s.dateFin);
            debut.setHours(0,0,0,0);
            fin.setHours(23,59,59,999);
            return currentDate >= debut && currentDate <= fin;
        });
        
        basePrice += currentSeason ? currentSeason.prixParJour : model.prixParJour;
    }
    
    let totalPrice = basePrice;

    // Add Location Fees
    if (locationId) {
        const loc = await prisma.location.findUnique({ where: { id: locationId } });
        if (loc) totalPrice += loc.fraisSupplementaires;
    }

    // Return Location Fee if different or explicitly set
    // Logic: If returnLocationId is set, check fee.
    // If not set, but we fallback to locationId (line 127), should we charge again?
    // Usually return to SAME location doesn't incur extra fee if it's the standard dropoff.
    // BUT the fee is "Frais supplémentaires" on the location object itself (e.g. Airport tax).
    // If you pick up at Airport (+50) and Drop off at Airport (+50?), usually it's per trip leg.
    // However, common practice is Pick-up fee + Drop-off fee (if different or one-way).
    // Let's assume the fee applies to the ACTION using that location.

    // Simplification for this request: One-time fee per location usage? 
    // "rajoute le prix de la localisation si il y'a des frais supplémentaire"
    // Let's add fee for pickup.
    // Let's add fee for return IF it is distinct or if logic dictates.
    // The previous logic for `lieuRetour` determination (lines 125-129) is:
    // If `returnLocationId` exists -> Use it.
    // If custom stuff -> null.
    // If standard mode (no custom), fallback to pickup location.

    // If I return to the SAME location, do I pay the fee again? 
    // Users usually expect "Airport Fee" once per rental or per entering/leaving?
    // Let's assume we add the fee for the Pickup Location.
    // And if Return Location is DIFFERENT and has a fee, we add it? Or if it's the same, do we double it?
    // Let's stick to: Add fee for Pickup Location. Add fee for Return Location.

    // Determine effective return ID
    const effectiveReturnId = returnLocationId
        ? returnLocationId
        : (!customReturnLocation && !customLocation && locationId)
            ? locationId
            : null;

    if (effectiveReturnId) {
        // Optimization: If it's same ID, we already fetched it, but for safety lets fetch or reuse.
        if (effectiveReturnId === locationId) {
            // If we want to charge twice for same location (Pickup + Return), uncomment:
            // const loc = await prisma.location.findUnique({ where: { id: effectiveReturnId } });
            // if (loc) totalPrice += loc.fraisSupplementaires;

            // BUT usually Airport Fee is one-off. 
            // Let's assume we ONLY charge for the Pickup location fees for now, or distinct return fees.
            // Actually, the user prompts "prix de la localisation", likely pickup fee.
            // I will add fee for Pickup.
            // I will add fee for Return ONLY if it is DIFFERENT from Pickup?
            // Or simpler: Just charge for every location involved.
            // Let's charge for Pickup.
            // Let's charge for Return.

            const loc = await prisma.location.findUnique({ where: { id: effectiveReturnId } });
            // If it's the SAME location, we might want to NOT charge double if the fee is "Pickup Fee".
            // But 'fraisSupplementaires' could be "Out of city fee".
            // Let's be safe: Add fee for pickup.
            // Add fee for return.
            if (loc) totalPrice += loc.fraisSupplementaires;
        } else {
            const loc = await prisma.location.findUnique({ where: { id: effectiveReturnId } });
            if (loc) totalPrice += loc.fraisSupplementaires;
        }
    }
    // Correct logic: The previous block adds logic.
    // Let's simplify:
    // 1. Pickup Fee.
    // 2. Return Fee.
    // Resetting total price calculation to be clean.
    totalPrice = basePrice;

    if (locationId) {
        const loc = await prisma.location.findUnique({ where: { id: locationId } });
        if (loc) totalPrice += loc.fraisSupplementaires;
    }

    if (effectiveReturnId) {
        const loc = await prisma.location.findUnique({ where: { id: effectiveReturnId } });
        // If effectiveReturnId == locationId, we are charging TWICE.
        // E.g. Airport Pickup (50) + Airport Return (50) = 100.
        // This is reasonable for "Service Fee".
        if (loc) totalPrice += loc.fraisSupplementaires;
    }


    let reservation;
    try {
        reservation = await prisma.reservation.create({
            data: {
                dateDebut: startDateTime,
                dateFin: endDateTime,
                prixTotal: totalPrice,
                clientNom: lastName,
                clientPrenom: firstName,
                clientEmail: email,
                clientTel: phone,
                status: 'PENDING',

                // Use connect for relation
                vehicule: {
                    connect: { id: availableVehicle.id }
                },

                // Use connect for optional locations if ID matches, else null
                lieuPriseEnCharge: locationId ? { connect: { id: locationId } } : undefined,
                lieuRetour: effectiveReturnId ? { connect: { id: effectiveReturnId } } : undefined,

                // Custom fields
                customPriseEnCharge: customLocation || undefined,
                customRetour: customReturnLocation || customLocation || undefined,
            }
        });
    } catch (e) {
        console.error(e);
        return { error: 'Une erreur est survenue lors de la création de la réservation.' };
    }

    // --- ENVOI D'EMAIL VIA BREVO ---
    try {
        let pickupName = customLocation || 'Adresse personnalisée';
        let returnName = customReturnLocation || customLocation || 'Adresse personnalisée';

        if (locationId) {
            const l = await prisma.location.findUnique({ where: { id: locationId } });
            if (l) pickupName = l.nom;
        }
        if (effectiveReturnId) {
            const l = await prisma.location.findUnique({ where: { id: effectiveReturnId } });
            if (l) returnName = l.nom;
        }

        const sDateParts = startDateStr.split('-');
        const formattedStart = `${sDateParts[2]}/${sDateParts[1]}/${sDateParts[0]}`;
        const eDateParts = endDateStr.split('-');
        const formattedEnd = `${eDateParts[2]}/${eDateParts[1]}/${eDateParts[0]}`;

        const emailHtml = `
<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
    <div style="background-color: #1a1a1a; padding: 25px; text-align: center; border-bottom: 4px solid #cfaa5b;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">Demande de Réservation</h1>
    </div>
    <div style="padding: 30px; background-color: #ffffff;">
        <p style="font-size: 16px; margin-top: 0;">Bonjour <strong>${firstName} ${lastName}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.5;">Nous avons bien reçu votre demande de réservation pour le véhicule <strong>${model.nom}</strong>.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #cfaa5b;">
            <h2 style="font-size: 18px; margin-top: 0; color: #1a1a1a; margin-bottom: 15px;">Récapitulatif de votre demande</h2>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 15px; line-height: 1.8;">
                <li><strong>🗓️ Du :</strong> ${formattedStart} à ${startTime || '00:00'}</li>
                <li><strong>🗓️ Au :</strong> ${formattedEnd} à ${returnTime || '00:00'}</li>
                <li><strong>📍 Prise en charge :</strong> ${pickupName}</li>
                <li><strong>📍 Retour :</strong> ${returnName}</li>
                <li><strong>💶 Prix total estimé :</strong> <span style="color: #28a745; font-weight: bold;">${totalPrice} DH</span></li>
            </ul>
        </div>
        
        <p style="font-size: 16px; font-weight: bold; color: #d9534f; border: 1px dashed #d9534f; padding: 15px; border-radius: 5px; text-align: center;">
            ⏳ Pour assurer la disponibilité et valider définitivement votre dossier, notre équipe prendra contact avec vous par téléphone sous peu. Cette étape est nécessaire pour confirmer la réservation.
        </p>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            Merci de votre confiance !<br>
            <strong>L'équipe de location</strong>
        </p>
    </div>
</div>
        `;

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
                    { email: email, name: `${firstName} ${lastName}` }
                ],
                bcc: [
                    { email: 'contact@bouderba-rental.com', name: 'Admin Bouderba Rental' }
                ],
                subject: 'Votre demande de réservation est en cours - Validation imminente',
                htmlContent: emailHtml
            })
        });

        if (!response.ok) {
            const errorInfo = await response.text();
            console.error('Erreur API Brevo (Statut HTTP', response.status, '):', errorInfo);
        }
    } catch (err) {
        console.error('Erreur lors de l\'envoi de l\'email Brevo:', err);
    }
    // --- FIN ENVOI EMAIL ---

    redirect(`/reservation/success?id=${reservation.id}`);
}
