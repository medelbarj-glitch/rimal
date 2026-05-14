"use client";

import { useState } from 'react';
import { Reservation, Location, Vehicule, ModeleVoiture } from '@prisma/client';

type ReservationWithDetails = Reservation & {
    vehicule: Vehicule & {
        modele: ModeleVoiture;
    };
    lieuPriseEnCharge: Location | null;
    lieuRetour: Location | null;
};

export function PriceRecapButton({ reservation }: { reservation: ReservationWithDetails }) {
    const [isOpen, setIsOpen] = useState(false);

    // Calculation Logic (Mirrors BookingForm/CreateReservation)
    const start = new Date(reservation.dateDebut);
    const end = new Date(reservation.dateFin);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let pickupFee = 0;
    if (reservation.lieuPriseEnCharge) {
        pickupFee = reservation.lieuPriseEnCharge.fraisSupplementaires;
    }

    let returnFee = 0;
    if (reservation.lieuRetour) {
        returnFee = reservation.lieuRetour.fraisSupplementaires;
    }

    // Creating logic matched server: we sum up fees.
    const totalFees = pickupFee + returnFee;
    let basePrice = 0;
    for (let i = 0; i < days; i++) {
        const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
        // We know from page.tsx that prixSaisonniers is included.
        // But to be safe with types, let's cast or assume it's there.
        const model = reservation.vehicule.modele as any;
        const currentSeason = model.prixSaisonniers?.find((s: any) => {
            const debut = new Date(s.dateDebut);
            const fin = new Date(s.dateFin);
            debut.setHours(0,0,0,0);
            fin.setHours(23,59,59,999);
            return currentDate >= debut && currentDate <= fin;
        });
        basePrice += currentSeason ? currentSeason.prixParJour : model.prixParJour;
    }

    // Note: The stored reservation.prixTotal SHOULD match basePrice + totalFees.
    // If it doesn't (due to manual edits or bugs), we show what we calculate vs stored.

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '5px 10px', marginLeft: '5px' }}
                title="Voir le détail du prix"
            >
                <i className="fas fa-receipt"></i>
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h3>Détail du Prix #{reservation.id}</h3>
                            <button className="close-button" onClick={() => setIsOpen(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Location base ({days}j)</span>
                                <strong>{basePrice} DH</strong>
                            </div>

                            {pickupFee > 0 && (
                                <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#666' }}>
                                    <span>Frais Départ ({reservation.lieuPriseEnCharge?.nom})</span>
                                    <span>+ {pickupFee} DH</span>
                                </div>
                            )}

                            {returnFee > 0 && (
                                <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#666' }}>
                                    <span>Frais Retour ({reservation.lieuRetour?.nom})</span>
                                    <span>+ {returnFee} DH</span>
                                </div>
                            )}

                            <hr style={{ margin: '15px 0', border: '0', borderTop: '1px solid #eee' }} />

                            <div className="price-row total" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
                                <span>Total Enregistré</span>
                                <strong style={{ color: '#B49339' }}>{reservation.prixTotal} DH</strong>
                            </div>

                            {(basePrice + totalFees) !== reservation.prixTotal && (
                                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'orange' }}>
                                    <i className="fas fa-exclamation-triangle"></i> Attention: Le total calculé ({basePrice + totalFees} DH) diffère du prix enregistré.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
