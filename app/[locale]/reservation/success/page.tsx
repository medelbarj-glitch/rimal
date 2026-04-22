import React from 'react';
import Link from 'next/link';
import '../../../../styles/success.css';
import { NavbarAndMenu } from '../../../components/Menu';
import { prisma } from '@/lib/prisma';

import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { PrintButton } from '../../../components/PrintButton';

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
    const { id: idStr } = await searchParams;
    const voitures = await prisma.modeleVoiture.findMany();
    const locations = await prisma.location.findMany();
    const settings = await prisma.setting.findUnique({ where: { id: 1 } });
    const logoUrl = settings?.logoUrl || '/default-logo.png';

    if (!idStr) {
        // Fallback layout if no ID (legacy or direct access)
        return (
            <>
                <NavbarAndMenu voitures={voitures} locations={locations} logoUrl={logoUrl} />
                <div className="success-layout">
                    <div className="success-modal">
                        <div className="checkmark-container">
                            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        </div>
                        <h1 className="success-title">Réservation Confirmée !</h1>
                        <p className="success-message" style={{ color: '#d9534f', fontWeight: 'bold', padding: '15px', border: '1px dashed #d9534f', borderRadius: '5px', marginTop: '20px' }}>
                            Pour assurer la disponibilité et valider définitivement votre dossier, notre équipe prendra contact avec vous par téléphone sous peu. Cette étape est nécessaire pour confirmer la réservation.
                        </p>
                        <Link href="/" className="btn-home">
                            Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    const reservationId = parseInt(idStr);
    if (isNaN(reservationId)) return notFound();

    const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        include: {
            vehicule: {
                include: { modele: true }
            },
            lieuPriseEnCharge: true,
            lieuRetour: true
        }
    });

    if (!reservation) return notFound();

    // Calculate Fees breakdown for display
    let locFees = 0;
    if (reservation.lieuPriseEnCharge) locFees += reservation.lieuPriseEnCharge.fraisSupplementaires;
    if (reservation.lieuRetour) {
        // Logic must match creation: if same location, did we add it twice? 
        // In creation logic, we added it if effectiveReturnId existed.
        // Here we just sum them up. If creation added it twice (pickup + return even if same), then this sum is correct.
        locFees += reservation.lieuRetour.fraisSupplementaires;
    }

    const days = Math.ceil((reservation.dateFin.getTime() - reservation.dateDebut.getTime()) / (1000 * 60 * 60 * 24));


    return (
        <>
            <NavbarAndMenu voitures={voitures} locations={locations} logoUrl={logoUrl} />
            <div className="success-layout">
                <div className="success-modal wide">
                    <div className="checkmark-container small">
                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                    </div>

                    <h1 className="success-title">Réservation Confirmée !</h1>
                    <p className="success-subtitle">Référence: #{reservation.id}</p>

                    <p className="success-message" style={{ color: '#d9534f', fontWeight: 'bold', padding: '15px', border: '1px dashed #d9534f', borderRadius: '5px', marginTop: '20px', marginBottom: '30px' }}>
                        ⏳ Pour assurer la disponibilité et valider définitivement votre dossier, notre équipe prendra contact avec vous par téléphone sous peu. Cette étape est nécessaire pour confirmer la réservation.
                    </p>

                    <div className="success-details-grid">
                        <div className="detail-group">
                            <h3>Véhicule</h3>
                            <div className="detail-content">
                                {reservation.vehicule.modele.imageUrl && (
                                    <img src={reservation.vehicule.modele.imageUrl} alt={reservation.vehicule.modele.nom} className="success-car-img" />
                                )}
                                <p className="car-name">{reservation.vehicule.modele.nom}</p>
                            </div>
                        </div>

                        <div className="detail-group">
                            <h3>Dates</h3>
                            <div className="detail-rows">
                                <div className="detail-row">
                                    <span>Départ</span>
                                    <strong>{format(reservation.dateDebut, 'dd/MM/yyyy HH:mm')}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Retour</span>
                                    <strong>{format(reservation.dateFin, 'dd/MM/yyyy HH:mm')}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Durée</span>
                                    <strong>{days} jours</strong>
                                </div>
                            </div>
                        </div>

                        <div className="detail-group">
                            <h3>Lieux</h3>
                            <div className="detail-rows">
                                <div className="detail-row">
                                    <span>Prise en charge</span>
                                    <strong>{reservation.lieuPriseEnCharge?.nom || reservation.customPriseEnCharge || 'Standard'}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Retour</span>
                                    <strong>{reservation.lieuRetour?.nom || reservation.customRetour || 'Standard'}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="detail-group total-group">
                            <h3>Paiement</h3>
                            <div className="detail-rows">
                                <div className="detail-row">
                                    <span>Location ({days}j)</span>
                                    <span>{reservation.prixTotal - locFees} DH</span>
                                </div>
                                {locFees > 0 && (
                                    <div className="detail-row highlight-fee">
                                        <span>Frais localisations</span>
                                        <span>+ {locFees} DH</span>
                                    </div>
                                )}
                                <div className="detail-row total">
                                    <span>Total</span>
                                    <span>{reservation.prixTotal} DH</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="success-actions">
                        <Link href="/" className="btn-home">
                            Retour à l'accueil
                        </Link>
                        <PrintButton />
                    </div>
                </div>
            </div>

        </>
    );
}
