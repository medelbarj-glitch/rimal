'use client';

import { useState, useEffect } from 'react';
import { createService, updateService } from '../services/actions';

interface ServiceItem {
    id: number;
    icon: string;
    title: string;
    description: string;
}

interface ServiceModalProps {
    service?: ServiceItem; // If present, edit mode
    trigger?: React.ReactNode;
}

import { createPortal } from 'react-dom';

export function ServiceModal({ service, trigger }: ServiceModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isEdit = !!service;

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            if (isEdit && service) {
                await updateService(service.id, formData);
            } else {
                await createService(formData);
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
                    <h3>{isEdit ? 'Modifier le Service' : 'Ajouter un Service'}</h3>
                    <button className="close-button" onClick={() => setIsOpen(false)}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form action={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Titre (Français)</label>
                        <input type="text" name="title" defaultValue={service?.title} required placeholder="Ex: Kilométrage Illimité" />
                    </div>
                    <div className="form-group">
                        <label>Titre (English)</label>
                        <input type="text" name="title_en" defaultValue={(service as any)?.title_en || ''} />
                    </div>
                    <div className="form-group">
                        <label>Titre (Español)</label>
                        <input type="text" name="title_es" defaultValue={(service as any)?.title_es || ''} />
                    </div>
                    <div className="form-group">
                        <label>Titre (العربية)</label>
                        <input type="text" name="title_ar" defaultValue={(service as any)?.title_ar || ''} dir="rtl" />
                    </div>
                    <div className="form-group">
                        <label>Titre (Marocain)</label>
                        <input type="text" name="title_ma" defaultValue={(service as any)?.title_ma || ''} dir="rtl" />
                    </div>

                    <div className="form-group">
                        <label>Icône (FontAwesome)</label>
                        <input
                            type="text"
                            name="icon"
                            defaultValue={service?.icon}
                            required
                            placeholder="Ex: fa-road"
                        />
                        <small style={{ display: 'block', marginTop: '5px', color: '#666', fontSize: '0.8rem' }}>
                            Utilisez des classes <a href="https://fontawesome.com/icons" target="_blank" style={{ textDecoration: 'underline' }}>FontAwesome</a>
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Description (Français)</label>
                        <textarea name="description" rows={3} defaultValue={service?.description} required placeholder="Description courte..."></textarea>
                    </div>
                    <div className="form-group">
                        <label>Description (English)</label>
                        <textarea name="description_en" rows={3} defaultValue={(service as any)?.description_en || ''}></textarea>
                    </div>
                    <div className="form-group">
                        <label>Description (Español)</label>
                        <textarea name="description_es" rows={3} defaultValue={(service as any)?.description_es || ''}></textarea>
                    </div>
                    <div className="form-group">
                        <label>Description (العربية)</label>
                        <textarea name="description_ar" rows={3} defaultValue={(service as any)?.description_ar || ''} dir="rtl"></textarea>
                    </div>
                    <div className="form-group">
                        <label>Description (Marocain)</label>
                        <textarea name="description_ma" rows={3} defaultValue={(service as any)?.description_ma || ''} dir="rtl"></textarea>
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
                    <i className="fas fa-plus"></i> Ajouter un Service
                </button>
            )}

            {isOpen && mounted && createPortal(modalContent, document.body)}
        </>
    );
}
