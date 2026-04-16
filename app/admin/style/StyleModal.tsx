'use client';

import { useState, useRef, useEffect } from 'react';
import { BackgroundImage } from '@prisma/client';
import { createBackgroundImage, updateBackgroundImage } from '@/app/actions/style';
import { ImageFileInput } from '../components/ImageFileInput';

interface StyleModalProps {
    image?: BackgroundImage; // If provided, we are in Edit mode
    trigger?: React.ReactNode; // Custom trigger button
}

import { createPortal } from 'react-dom';

export function StyleModal({ image, trigger }: StyleModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isEdit = !!image;

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            if (isEdit && image) {
                await updateBackgroundImage(image.id, formData);
            } else {
                await createBackgroundImage(formData);
            }
            setIsOpen(false);
            formRef.current?.reset();
        } catch (error) {
            console.error('Error saving background image:', error);
            alert('Une erreur est survenue lors de l\'enregistrement.');
        } finally {
            setIsLoading(false);
        }
    };

    const modalContent = (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{isEdit ? 'Modifier l\'image' : 'Ajouter une image'}</h3>
                    <button className="close-button" onClick={() => setIsOpen(false)}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form ref={formRef} action={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Titre (Français)</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={image?.name}
                            required
                            placeholder="Ex: Service premium"
                        />
                    </div>
                    <div className="form-group">
                        <label>Titre (English)</label>
                        <input type="text" name="title_en" defaultValue={(image as any)?.title_en || ''} />
                    </div>
                    <div className="form-group">
                        <label>Titre (Español)</label>
                        <input type="text" name="title_es" defaultValue={(image as any)?.title_es || ''} />
                    </div>
                    <div className="form-group">
                        <label>Titre (العربية)</label>
                        <input type="text" name="title_ar" defaultValue={(image as any)?.title_ar || ''} dir="rtl" />
                    </div>
                    <div className="form-group">
                        <label>Titre (Marocain)</label>
                        <input type="text" name="title_ma" defaultValue={(image as any)?.title_ma || ''} dir="rtl" />
                    </div>

                    <div className="form-group">
                        <label>Sous-titre (Français)</label>
                        <input
                            type="text"
                            name="subtitle"
                            defaultValue={image?.subtitle || ''}
                            placeholder="Ex: Location de voitures de luxe"
                        />
                    </div>
                    <div className="form-group">
                        <label>Sous-titre (English)</label>
                        <input type="text" name="subtitle_en" defaultValue={(image as any)?.subtitle_en || ''} />
                    </div>
                    <div className="form-group">
                        <label>Sous-titre (Español)</label>
                        <input type="text" name="subtitle_es" defaultValue={(image as any)?.subtitle_es || ''} />
                    </div>
                    <div className="form-group">
                        <label>Sous-titre (العربية)</label>
                        <input type="text" name="subtitle_ar" defaultValue={(image as any)?.subtitle_ar || ''} dir="rtl" />
                    </div>
                    <div className="form-group">
                        <label>Sous-titre (Marocain)</label>
                        <input type="text" name="subtitle_ma" defaultValue={(image as any)?.subtitle_ma || ''} dir="rtl" />
                    </div>

                    <div className="form-group">
                        <label>{isEdit ? "Remplacer l'image (Optionnel)" : "Image d'arrière-plan"}</label>
                        <ImageFileInput
                            name="imageFile"
                            accept="image/png, image/jpeg, image/webp"
                            required={!isEdit} // Obligatoire seulement si on crée une nouvelle image
                        />
                        {isEdit && image?.url && (
                            <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                                Laissez vide pour conserver l'image actuelle.
                            </small>
                        )}
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
                    className="btn-primary add-image-btn"
                >
                    <i className="fas fa-plus"></i> Ajouter une image
                </button>
            )}

            {isOpen && mounted && createPortal(modalContent, document.body)}
        </>
    );
}
