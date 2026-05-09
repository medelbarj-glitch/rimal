'use client';

import { useState } from 'react';
import { ModeleVoiture, Vehicule } from '@prisma/client';
import { EditModelForm } from './[id]/edit/EditModelForm';
import { DeleteModelButton, AddVehicleForm, VehicleItem } from './forms';

interface VehicleModelRowProps {
    modele: ModeleVoiture & { vehicules: Vehicule[], imagesModele?: any[] };
}

export function VehicleModelRow({ modele }: VehicleModelRowProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="data-item model-row">
            <div className="model-header">
                <div className="model-main-info">
                    {modele.imageUrl && (
                        <img src={modele.imageUrl} alt={modele.nom} className="model-image" />
                    )}
                    <div>
                        <h3 className="model-title">{modele.nom}</h3>
                        <p className="model-details">
                            {modele.transmission} • {modele.fuelType} • {modele.nbPlaces} places • <span className="model-price">{modele.prixParJour} DH/jour</span>
                        </p>
                    </div>
                </div>
                <div className="model-actions">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="btn-primary"
                        style={{ padding: '8px 15px', fontSize: '0.9rem' }}
                    >
                        {isEditing ? 'Fermer' : 'Modifier'}
                    </button>
                    <DeleteModelButton id={modele.id} />
                </div>
            </div>

            {isEditing && (
                <div className="edit-model-container">
                    <h4 className="edit-model-title">Modifier le Modèle</h4>
                    <EditModelForm modele={modele} onSuccess={() => setIsEditing(false)} />
                </div>
            )}

            <div className="stock-section">
                <h4 className="stock-title">
                    Véhicules en Stock ({modele.vehicules.length})
                </h4>

                {modele.vehicules.length === 0 ? (
                    <p className="stock-empty">Aucun véhicule physique enregistré.</p>
                ) : (
                    <div className="stock-list">
                        {modele.vehicules.map((v) => (
                            <VehicleItem key={v.id} vehicle={v} />
                        ))}
                    </div>
                )}

                <AddVehicleForm modeleId={modele.id} />
            </div>
        </div>
    );
}
