'use client';

import { createOption, updateOption, toggleOptionActive, deleteOption } from '@/app/actions/optionActions';
import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { OptionReservation } from '@prisma/client';

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

const ICON_PRESETS = [
    { value: 'fa-baby-carriage', label: '🍼 Siège bébé' },
    { value: 'fa-location-dot', label: '📍 GPS' },
    { value: 'fa-shield-halved', label: '🛡️ Assurance' },
    { value: 'fa-user-plus', label: '👤 Conducteur supp.' },
    { value: 'fa-suitcase-rolling', label: '🧳 Porte-bagages' },
    { value: 'fa-wifi', label: '📶 WiFi' },
    { value: 'fa-snowflake', label: '❄️ Glacière' },
    { value: 'fa-car-side', label: '🚗 Livraison' },
    { value: 'fa-phone', label: '📱 Support 24h' },
    { value: 'fa-star', label: '⭐ Autre' },
];

export function AddOptionForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [error, setError] = useState<string | null>(null);

    return (
        <form
            action={async (formData) => {
                setError(null);
                try {
                    const result = await createOption(formData);
                    if (result.success) {
                        formRef.current?.reset();
                    } else {
                        setError(result.error || 'Erreur inconnue');
                    }
                } catch (err) {
                    console.error("Erreur de création:", err);
                    setError("Une erreur est survenue lors de la création.");
                }
            }}
            ref={formRef}
            className="admin-form-container compact"
        >
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Nom de l'option (Français) *</label>
                    <input name="nom" required type="text" placeholder="Ex: Siège bébé" />
                </div>
                <div className="form-group">
                    <label className="form-label">Nom (English)</label>
                    <input name="nom_en" type="text" placeholder="Baby seat" />
                </div>
                <div className="form-group">
                    <label className="form-label">Nom (Español)</label>
                    <input name="nom_es" type="text" placeholder="Silla de bebé" />
                </div>
                <div className="form-group">
                    <label className="form-label">Nom (العربية)</label>
                    <input name="nom_ar" type="text" dir="rtl" />
                </div>
                <div className="form-group">
                    <label className="form-label">Nom (Marocain)</label>
                    <input name="nom_ma" type="text" dir="rtl" />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Prix (DH) *</label>
                    <input name="prix" type="number" required min="0" placeholder="50" />
                </div>
                <div className="form-group">
                    <label className="form-label">Type de tarification</label>
                    <select name="perDay" defaultValue="false">
                        <option value="false">Prix fixe (toute la location)</option>
                        <option value="true">Prix par jour</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Quantité max par réservation</label>
                    <input name="maxQuantite" type="number" defaultValue={1} min={1} max={10} />
                </div>
                <div className="form-group">
                    <label className="form-label">Icône</label>
                    <select name="icon" defaultValue="fa-star">
                        {ICON_PRESETS.map((preset) => (
                            <option key={preset.value} value={preset.value}>
                                {preset.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div style={{ color: '#e74c3c', marginTop: '10px', fontSize: '0.9rem' }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '5px' }}></i>
                    {error}
                </div>
            )}

            <SubmitButton label="Créer l'option" loadingLabel="Création..." />
        </form>
    );
}

export function OptionItem({ option }: { option: OptionReservation }) {
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (isEditing) {
        return (
            <div className="data-item editing" style={{ display: 'block' }}>
                <form
                    action={async (formData) => {
                        setError(null);
                        try {
                            const result = await updateOption(option.id, formData);
                            if (result.success) {
                                setIsEditing(false);
                            } else {
                                setError(result.error || 'Erreur inconnue');
                            }
                        } catch (err) {
                            console.error("Erreur de mise à jour:", err);
                            setError("Impossible de mettre à jour cette option.");
                        }
                    }}
                    className="edit-form"
                >
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Nom (FR)</label>
                            <input name="nom" defaultValue={option.nom} required type="text" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nom (EN)</label>
                            <input name="nom_en" defaultValue={option.nom_en || ''} type="text" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nom (ES)</label>
                            <input name="nom_es" defaultValue={option.nom_es || ''} type="text" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nom (AR)</label>
                            <input name="nom_ar" defaultValue={option.nom_ar || ''} type="text" dir="rtl" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nom (MA)</label>
                            <input name="nom_ma" defaultValue={option.nom_ma || ''} type="text" dir="rtl" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Prix (DH)</label>
                            <input name="prix" defaultValue={option.prix} type="number" required min="0" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Type de tarification</label>
                            <select name="perDay" defaultValue={option.perDay ? 'true' : 'false'}>
                                <option value="false">Prix fixe (toute la location)</option>
                                <option value="true">Prix par jour</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Quantité max</label>
                            <input name="maxQuantite" defaultValue={option.maxQuantite} type="number" min={1} max={10} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Icône</label>
                            <select name="icon" defaultValue={option.icon}>
                                {ICON_PRESETS.map((preset) => (
                                    <option key={preset.value} value={preset.value}>
                                        {preset.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div style={{ color: '#e74c3c', marginTop: '10px', fontSize: '0.9rem' }}>
                            <i className="fas fa-exclamation-triangle" style={{ marginRight: '5px' }}></i>
                            {error}
                        </div>
                    )}

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
                {/* Icon */}
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '10px',
                    background: option.actif ? 'linear-gradient(135deg, #1a1a1a, #333)' : '#ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <i className={`fas ${option.icon}`} style={{
                        color: option.actif ? '#cfaa5b' : '#999',
                        fontSize: '1.2rem'
                    }}></i>
                </div>

                <div className="data-info" style={{ flex: 1 }}>
                    <h3 style={{ opacity: option.actif ? 1 : 0.5 }}>
                        {option.nom}
                        {!option.actif && (
                            <span style={{
                                marginLeft: '8px',
                                fontSize: '0.7rem',
                                background: '#f8d7da',
                                color: '#721c24',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                verticalAlign: 'middle'
                            }}>
                                Désactivée
                            </span>
                        )}
                    </h3>
                    <p style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', color: '#B49339' }}>
                            {option.prix} DH{option.perDay ? ' / jour' : ' (fixe)'}
                        </span>
                        <span style={{ color: '#888', fontSize: '0.85rem' }}>
                            <i className="fas fa-layer-group" style={{ marginRight: '4px' }}></i>
                            Max {option.maxQuantite} par réservation
                        </span>
                    </p>
                </div>
            </div>

            <div className="data-actions">
                {/* Toggle Active */}
                <button
                    onClick={async () => {
                        try {
                            await toggleOptionActive(option.id);
                        } catch (err) {
                            alert("Erreur lors du changement de statut.");
                        }
                    }}
                    className={option.actif ? 'btn-secondary' : 'btn-success'}
                    style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                    title={option.actif ? 'Désactiver' : 'Activer'}
                >
                    <i className={`fas ${option.actif ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
                
                {/* Edit */}
                <button
                    className="btn-edit"
                    onClick={() => setIsEditing(true)}
                    style={{ padding: '5px 10px', cursor: 'pointer', background: '#e0e0e0', border: 'none', borderRadius: '4px' }}
                >
                    Modifier
                </button>

                {/* Delete */}
                <button
                    onClick={async () => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer cette option ?')) {
                            try {
                                await deleteOption(option.id);
                            } catch (err) {
                                console.error("Erreur de suppression:", err);
                                alert("Impossible de supprimer cette option.");
                            }
                        }
                    }}
                    className="btn-danger"
                >
                    Supprimer
                </button>
            </div>
        </div>
    );
}
