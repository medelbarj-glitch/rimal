'use client';

import { createLocation, deleteLocation, updateLocation } from '@/app/actions/admin';
import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Location } from '@prisma/client';

function SubmitButton({ label, loadingLabel }: { label: string, loadingLabel: string }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="btn-primary"
            style={{ width: '100%', marginTop: '20px' }}
        >
            {pending ? loadingLabel : label}
        </button>
    );
}

export function AddLocationForm() {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <form
            action={async (formData) => {
                await createLocation(formData);
                formRef.current?.reset();
            }}
            ref={formRef}
            className="admin-form-container compact"
        >
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Nom du Lieu</label>
                    <input name="nom" required type="text" placeholder="Ex: Aéroport Marrakech" />
                </div>
                <div className="form-group">
                    <label className="form-label">Frais Supplémentaires (DH)</label>
                    <input name="fraisSupplementaires" type="number" defaultValue={0} />
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Adresse (Optionnel)</label>
                <input name="adresse" type="text" placeholder="Adresse complète..." />
            </div>
            
            {/* Modification : Remplacement de l'URL par un upload de fichier */}
            <div className="form-group">
                <label className="form-label">Image d'illustration (Optionnel)</label>
                <input 
                    name="imageFile" 
                    type="file" 
                    accept="image/png, image/jpeg, image/webp"
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', backgroundColor: 'white' }}
                />
            </div>
            
            <SubmitButton label="Créer le Lieu" loadingLabel="Création..." />
        </form>
    );
}

export function LocationItem({ location }: { location: Location }) {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <div className="data-item editing" style={{ display: 'block' }}>
                <form
                    action={async (formData) => {
                        await updateLocation(location.id, formData);
                        setIsEditing(false);
                    }}
                    className="edit-form"
                >
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Nom</label>
                            <input name="nom" defaultValue={location.nom} required type="text" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Frais (DH)</label>
                            <input name="fraisSupplementaires" defaultValue={location.fraisSupplementaires} type="number" />
                        </div>
                    </div>
                    
                    {/* Restructuration : Déplacé l'adresse et l'image dans une ligne pour gagner de la place si tu le souhaites, sinon on les garde en colonne */}
                    <div className="form-group">
                        <label className="form-label">Adresse</label>
                        <input name="adresse" defaultValue={location.adresse || ''} type="text" />
                    </div>

                    {/* Modification : Remplacement de l'URL par un upload de fichier */}
                    <div className="form-group">
                        <label className="form-label">Remplacer l'image (Optionnel)</label>
                        <input 
                            name="imageFile" 
                            type="file" 
                            accept="image/png, image/jpeg, image/webp"
                            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', backgroundColor: 'white' }}
                        />
                        {location.imageUrl && (
                            <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                                Laissez vide pour conserver l'image actuelle.
                            </small>
                        )}
                    </div>

                    <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <SubmitButton label="Enregistrer" loadingLabel="Sauvegarde..." />
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setIsEditing(false)}
                            style={{ marginTop: '20px' }}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="data-item">
            <div className="data-item-content">
                {location.imageUrl && (
                    <img
                        src={location.imageUrl}
                        alt={location.nom}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginRight: '15px' }}
                    />
                )}
                <div className="data-info">
                    <h3>{location.nom}</h3>
                    {location.adresse && <p>{location.adresse}</p>}
                    {location.fraisSupplementaires > 0 && (
                        <span className="location-fees-badge">
                            + {location.fraisSupplementaires} DH frais
                        </span>
                    )}
                </div>
            </div>
            <div className="data-actions">
                <button
                    className="btn-edit"
                    onClick={() => setIsEditing(true)}
                    style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer', background: '#e0e0e0', border: 'none', borderRadius: '4px' }}
                >
                    Modifier
                </button>
                <DeleteLocationButton id={location.id} />
            </div>
        </div>
    );
}

export function DeleteLocationButton({ id }: { id: number }) {
    return (
        <button
            onClick={() => {
                if (confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) {
                    deleteLocation(id)
                }
            }}
            className="btn-danger"
        >
            Supprimer
        </button>
    );
}