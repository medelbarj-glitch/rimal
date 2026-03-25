'use client';

import { useState, useEffect } from 'react';
import { createExperience, updateExperience } from '../experience/actions';

interface ExperienceItem {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    buttonText: string;
}

interface ExperienceModalProps {
    item?: ExperienceItem;
    trigger?: React.ReactNode;
}

import { createPortal } from 'react-dom';

export function ExperienceModal({ item, trigger }: ExperienceModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isEdit = !!item;

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            if (isEdit && item) {
                await updateExperience(item.id, formData);
            } else {
                await createExperience(formData);
            }
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            alert('Erreur lors de l’enregistrement');
        } finally {
            setIsLoading(false);
        }
    };

    const modalContent = (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{isEdit ? 'Modifier l\'Expérience' : 'Ajouter une Expérience'}</h3>
                    <button className="close-button" onClick={() => setIsOpen(false)}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form action={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Titre</label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={item?.title}
                            required
                            placeholder="Ex: L'Excellence..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            rows={6}
                            defaultValue={item?.description}
                            required
                            placeholder="Texte descriptif..."
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>{isEdit ? "Remplacer l'image (Optionnel)" : "Image d'illustration"}</label>
                        <input
                            type="file"
                            name="imageFile"
                            accept="image/png, image/jpeg, image/webp"
                            required={!isEdit}
                            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', backgroundColor: 'white' }}
                        />
                        {isEdit && item?.imageUrl && (
                            <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                                Laissez vide pour conserver l'image actuelle.
                            </small>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Texte Bouton</label>
                        <input
                            type="text"
                            name="buttonText"
                            defaultValue={item?.buttonText}
                            placeholder="Ex: Découvrir..."
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Ajouter')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <>
            {trigger ? (
                <div onClick={() => setIsOpen(true)}>{trigger}</div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn-submit"
                    style={{ width: 'auto', marginBottom: '1rem' }}
                >
                    <i className="fas fa-plus"></i> Ajouter une Expérience
                </button>
            )}

            {isOpen && mounted && createPortal(modalContent, document.body)}
        </>
    );
}
