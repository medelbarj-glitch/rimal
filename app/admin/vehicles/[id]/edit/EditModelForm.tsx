'use client';

import { updateModel } from '@/app/actions/admin';
import { StatutVehicule, Transmission, FuelType, ModeleVoiture } from '@prisma/client';
import { useFormStatus } from 'react-dom';
import { ImageFileInput } from '../../../components/ImageFileInput';
import { deleteGalleryImage } from '@/app/actions/admin';
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
    modele: ModeleVoiture & { imagesModele?: { id: number, url: string }[] };
    onSuccess?: () => void;
}

export function EditModelForm({ modele, onSuccess }: EditModelFormProps) {
    const [existingImages, setExistingImages] = useState(modele.imagesModele || []);

    const handleDeleteImage = async (imageId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
        await deleteGalleryImage(imageId);
        setExistingImages(existingImages.filter(img => img.id !== imageId));
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
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#666' }}>Galerie actuelle</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {existingImages.map((img) => (
                            <div key={img.id} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
                                <img src={img.url} alt="Galerie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteImage(img.id)}
                                    style={{ position: 'absolute', top: '5px', right: '5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
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
