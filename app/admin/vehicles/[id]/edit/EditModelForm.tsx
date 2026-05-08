'use client';

import { updateModel } from '@/app/actions/admin';
import { StatutVehicule, Transmission, FuelType, ModeleVoiture } from '@prisma/client';
import { useFormStatus } from 'react-dom';
import { ImageFileInput } from '../../../components/ImageFileInput';
import { deleteGalleryImage, reorderGalleryImages } from '@/app/actions/admin';
import { useState } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="btn-primary"
            style={{ width: '100%', marginTop: '20px' }}
        >
            {pending ? 'Mise à jour...' : 'Mettre à jour le Modèle'}
        </button>
    );
}

interface EditModelFormProps {
    modele: ModeleVoiture & { imagesModele?: { id: number, url: string, ordre: number }[] };
    onSuccess?: () => void;
}

export function EditModelForm({ modele, onSuccess }: EditModelFormProps) {
    const [existingImages, setExistingImages] = useState(
        (modele.imagesModele || []).sort((a, b) => a.ordre - b.ordre)
    );

    const handleDeleteImage = async (imageId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
        await deleteGalleryImage(imageId);
        setExistingImages(existingImages.filter(img => img.id !== imageId));
    };

    const handleMoveImage = async (index: number, direction: 'left' | 'right') => {
        const newImages = [...existingImages];
        const targetIndex = direction === 'left' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newImages.length) return;

        // Swap
        [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
        setExistingImages(newImages);

        // Save new order to DB
        await reorderGalleryImages(newImages.map(img => img.id));
    };

    const btnStyle: React.CSSProperties = {
        position: 'absolute', background: 'rgba(0,0,0,0.7)', color: 'white',
        border: 'none', borderRadius: '50%', width: '22px', height: '22px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '10px', zIndex: 2
    };

    return (
        <form
            action={async (formData) => {
                await updateModel(modele.id, formData);
                if (onSuccess) {
                    onSuccess();
                }
            }}
            className="admin-form-container"
            style={{ padding: '0', boxShadow: 'none', margin: '0', background: 'transparent' }}
        >
            <div className="form-row">
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Nom du Modèle</label>
                    <input name="nom" required type="text" defaultValue={modele.nom} />
                </div>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Prix par Jour (DH)</label>
                    <input name="prixParJour" required type="number" defaultValue={modele.prixParJour} />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Remplacer l'Image Principale (Miniature)</label>
                    <ImageFileInput
                        name="imageFile"
                        accept="image/png, image/jpeg, image/webp"
                    />
                </div>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Ajouter des photos à la Galerie (Page détail)</label>
                    <ImageFileInput
                        name="galleryFiles"
                        accept="image/png, image/jpeg, image/webp"
                        multiple
                    />
                </div>
            </div>

            {existingImages.length > 0 && (
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#666' }}>
                        Galerie actuelle <span style={{ color: '#999', fontWeight: 'normal' }}>— Utilisez les flèches pour réordonner</span>
                    </label>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {existingImages.map((img, index) => (
                            <div key={img.id} style={{ position: 'relative', width: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #eee' }}>
                                <img src={img.url} alt={`Galerie ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                
                                {/* Position badge */}
                                <span style={{ position: 'absolute', top: '4px', left: '4px', background: '#B49339', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                                    {index + 1}
                                </span>

                                {/* Delete button */}
                                <button type="button" onClick={() => handleDeleteImage(img.id)}
                                    style={{ ...btnStyle, top: '4px', right: '4px', background: '#e74c3c' }}>
                                    <i className="fas fa-times" style={{ fontSize: '9px' }}></i>
                                </button>

                                {/* Move left */}
                                {index > 0 && (
                                    <button type="button" onClick={() => handleMoveImage(index, 'left')}
                                        style={{ ...btnStyle, bottom: '4px', left: '4px' }}>
                                        <i className="fas fa-chevron-left" style={{ fontSize: '9px' }}></i>
                                    </button>
                                )}

                                {/* Move right */}
                                {index < existingImages.length - 1 && (
                                    <button type="button" onClick={() => handleMoveImage(index, 'right')}
                                        style={{ ...btnStyle, bottom: '4px', right: '4px' }}>
                                        <i className="fas fa-chevron-right" style={{ fontSize: '9px' }}></i>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="form-row">
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Nombre de Places</label>
                    <input name="nbPlaces" required type="number" defaultValue={modele.nbPlaces} />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Transmission</label>
                    <select name="transmission" defaultValue={modele.transmission}>
                        {Object.values(Transmission).map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Carburant</label>
                    <select name="fuelType" defaultValue={modele.fuelType}>
                        {Object.values(FuelType).map((f) => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Description (Français)</label>
                <textarea name="description" rows={2} defaultValue={modele.description || ''} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'inherit' }}></textarea>
            </div>
            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Description (English)</label>
                <textarea name="description_en" rows={2} defaultValue={(modele as any).description_en || ''} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'inherit' }}></textarea>
            </div>
            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Description (Español)</label>
                <textarea name="description_es" rows={2} defaultValue={(modele as any).description_es || ''} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'inherit' }}></textarea>
            </div>
            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Description (العربية)</label>
                <textarea name="description_ar" rows={2} defaultValue={(modele as any).description_ar || ''} dir="rtl" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'inherit' }}></textarea>
            </div>
            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Description (الدارجة/Marocain)</label>
                <textarea name="description_ma" rows={2} defaultValue={(modele as any).description_ma || ''} dir="rtl" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'inherit' }}></textarea>
            </div>

            <SubmitButton />
        </form>
    );
}
