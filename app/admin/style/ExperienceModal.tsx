'use client';

import { useState, useEffect } from 'react';
import { createExperience, updateExperience } from '../experience/actions';
import { ImageFileInput } from '../components/ImageFileInput';

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

                <form action={handleSubmit} className="modal-form" encType="multipart/form-data">
                    <div className="form-group">
                        <label>Titre (Français)</label>
                        <input type="text" name="title" defaultValue={item?.title} required placeholder="Ex: L'Excellence..." />
                    </div>
                    <div className="form-group">
                        <label>Titre (English)</label>
                        <input type="text" name="title_en" defaultValue={(item as any)?.title_en || ''} />
                    </div>
                    <div className="form-group">
                        <label>Titre (Español)</label>
                        <input type="text" name="title_es" defaultValue={(item as any)?.title_es || ''} />
                    </div>
                    <div className="form-group">
                        <label>Titre (العربية)</label>
                        <input type="text" name="title_ar" defaultValue={(item as any)?.title_ar || ''} dir="rtl" />
                    </div>
                    <div className="form-group">
                        <label>Titre (Marocain)</label>
                        <input type="text" name="title_ma" defaultValue={(item as any)?.title_ma || ''} dir="rtl" />
                    </div>

                    <div className="form-group">
                        <label>Description (Français)</label>
                        <textarea name="description" rows={3} defaultValue={item?.description} required placeholder="Texte descriptif..."></textarea>
                    </div>
                    <div className="form-group">
                        <label>Description (English)</label>
                        <textarea name="description_en" rows={3} defaultValue={(item as any)?.description_en || ''}></textarea>
                    </div>
                    <div className="form-group">
                        <label>Description (Español)</label>
                        <textarea name="description_es" rows={3} defaultValue={(item as any)?.description_es || ''}></textarea>
                    </div>
                    <div className="form-group">
                        <label>Description (العربية)</label>
                        <textarea name="description_ar" rows={3} defaultValue={(item as any)?.description_ar || ''} dir="rtl"></textarea>
                    </div>
                    <div className="form-group">
                        <label>Description (Marocain)</label>
                        <textarea name="description_ma" rows={3} defaultValue={(item as any)?.description_ma || ''} dir="rtl"></textarea>
                    </div>

                    <div className="form-group">
                        <label>{isEdit ? "Remplacer l'image (Optionnel)" : "Image d'illustration"}</label>
                        <ImageFileInput
                            name="imageFile"
                            accept="image/png, image/jpeg, image/webp"
                            required={!isEdit}
                        />
                        {isEdit && item?.imageUrl && (
                            <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                                Laissez vide pour conserver l'image actuelle.
                            </small>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Texte Bouton (Français)</label>
                        <input type="text" name="buttonText" defaultValue={item?.buttonText} placeholder="Ex: Découvrir..." />
                    </div>
                    <div className="form-group">
                        <label>Texte Bouton (English)</label>
                        <input type="text" name="buttonText_en" defaultValue={(item as any)?.buttonText_en || ''} />
                    </div>
                    <div className="form-group">
                        <label>Texte Bouton (Español)</label>
                        <input type="text" name="buttonText_es" defaultValue={(item as any)?.buttonText_es || ''} />
                    </div>
                    <div className="form-group">
                        <label>Texte Bouton (العربية)</label>
                        <input type="text" name="buttonText_ar" defaultValue={(item as any)?.buttonText_ar || ''} dir="rtl" />
                    </div>
                    <div className="form-group">
                        <label>Texte Bouton (Marocain)</label>
                        <input type="text" name="buttonText_ma" defaultValue={(item as any)?.buttonText_ma || ''} dir="rtl" />
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
