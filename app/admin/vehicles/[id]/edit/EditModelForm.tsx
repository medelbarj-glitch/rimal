'use client';

import { updateModel } from '@/app/actions/admin';
import { StatutVehicule, Transmission, FuelType, ModeleVoiture } from '@prisma/client';
import { useFormStatus } from 'react-dom';
import { ImageFileInput } from '../../../components/ImageFileInput';

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
    modele: ModeleVoiture;
    onSuccess?: () => void;
}

export function EditModelForm({ modele, onSuccess }: EditModelFormProps) {

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
            encType="multipart/form-data"
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
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Remplacer l'Image (Optionnel)</label>
                    <ImageFileInput
                        name="imageFile"
                        accept="image/png, image/jpeg, image/webp"
                    />
                </div>
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
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>Description</label>
                <textarea
                    name="description"
                    rows={3}
                    defaultValue={modele.description || ''}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'inherit' }}
                ></textarea>
            </div>

            <SubmitButton />
        </form>
    );
}
