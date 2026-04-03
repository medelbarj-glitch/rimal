'use client';

import { createLocation, deleteLocation, updateLocation } from '@/app/actions/admin';
import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Location } from '@prisma/client';
import { ImageFileInput } from '../components/ImageFileInput';

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
                try {
                    await createLocation(formData);
                    formRef.current?.reset();
                } catch (error) {
                    console.error("Erreur de création:", error);
                    alert("Une erreur est survenue lors de la création du lieu. Vérifiez votre connexion ou l'image.");
                }
            }}
            ref={formRef}
            className="admin-form-container compact"
            encType="multipart/form-data"
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
            
            <div className="form-group">
                <label className="form-label">Image d'illustration (Optionnel)</label>
                <ImageFileInput 
                    name="imageFile" 
                    accept="image/png, image/jpeg, image/webp"
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
                        try {
                            await updateLocation(location.id, formData);
                            setIsEditing(false);
                        } catch (error) {
                            console.error("Erreur de mise à jour:", error);
                            alert("Impossible de mettre à jour ce lieu.");
                        }
                    }}
                    className="edit-form"
                    encType="multipart/form-data"
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
                    
                    <div className="form-group">
                        <label className="form-label">Adresse</label>
                        <input name="adresse" defaultValue={location.adresse || ''} type="text" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Remplacer l'image (Optionnel)</label>
                        <ImageFileInput 
                            name="imageFile" 
                            accept="image/png, image/jpeg, image/webp"
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
            onClick={async () => {
                if (confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) {
                    try {
                        await deleteLocation(id);
                    } catch (error) {
                        console.error("Erreur de suppression:", error);
                        alert("Impossible de supprimer ce lieu. Des réservations y sont peut-être déjà liées.");
                    }
                }
            }}
            className="btn-danger"
        >
            Supprimer
        </button>
    );
}