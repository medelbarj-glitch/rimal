'use client';

import { createModel, createVehicle, deleteModel, deleteVehicle, updateVehicleStatus } from '@/app/actions/admin';
import { StatutVehicule, Transmission, FuelType } from '@prisma/client';
import { useRef } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitModelButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="btn-primary"
            style={{ width: '100%', marginTop: '20px' }}
        >
            {pending ? 'Création en cours...' : 'Créer le Modèle'}
        </button>
    );
}

function SubmitVehicleButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="btn-primary"
            style={{ height: '42px', marginTop: 'auto' }}
        >
            {pending ? '...' : 'Ajouter'}
        </button>
    );
}

export function AddModelForm() {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <form
            action={async (formData) => {
                await createModel(formData);
                formRef.current?.reset();
            }}
            ref={formRef}
            className="admin-form-container compact"
        >
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Nom du Modèle</label>
                    <input name="nom" required type="text" placeholder="Ex: Renault Clio 5" />
                </div>
                <div className="form-group">
                    <label className="form-label">Prix par Jour (DH)</label>
                    <input name="prixParJour" required type="number" />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Image (Upload)</label>
                    <input
                        type="file"
                        name="imageFile"
                        accept="image/png, image/jpeg, image/webp"
                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Nombre de Places</label>
                    <input name="nbPlaces" required type="number" defaultValue={5} />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Transmission</label>
                    <select name="transmission">
                        {Object.values(Transmission).map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Carburant</label>
                    <select name="fuelType">
                        {Object.values(FuelType).map((f) => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                    name="description"
                    rows={3}
                    className="form-textarea"
                ></textarea>
            </div>

            <SubmitModelButton />
        </form>
    );
}

export function AddVehicleForm({ modeleId }: { modeleId: number }) {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <form
            action={async (formData) => {
                await createVehicle(formData);
                formRef.current?.reset();
            }}
            ref={formRef}
            className="add-vehicle-form"
        >
            <input type="hidden" name="modeleId" value={modeleId} />
            <h4 className="add-vehicle-header">Ajouter un véhicule au stock</h4>
            <div className="add-vehicle-row">
                <div style={{ flex: 1 }}>
                    <label className="form-label">Plaque</label>
                    <input name="plaque" required type="text" placeholder="AA-123-AA" style={{ padding: '8px' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label className="form-label">Statut Initial</label>
                    <select name="statut" style={{ padding: '8px' }}>
                        {Object.values(StatutVehicule).map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <SubmitVehicleButton />
            </div>
        </form>
    );
}

export function VehicleItem({ vehicle }: { vehicle: any }) {
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'DISPONIBLE': return 'available';
            case 'MAINTENANCE': return 'unavailable';
            case 'LOUE': return 'unavailable';
            case 'RETIRE': return 'retired';
            default: return '';
        }
    };

    return (
        <div className="vehicle-item">
            <div className="vehicle-info">
                <span className="vehicle-plaque">{vehicle.plaque}</span>
                <span className={`status-badge ${getStatusClass(vehicle.statut)}`}>
                    {vehicle.statut}
                </span>
            </div>
            <div className="vehicle-actions">
                <select
                    defaultValue={vehicle.statut}
                    onChange={(e) => updateVehicleStatus(vehicle.id, e.target.value as StatutVehicule)}
                    className="vehicle-status-select"
                >
                    {Object.values(StatutVehicule).map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <button
                    onClick={() => deleteVehicle(vehicle.id)}
                    className="btn-danger btn-sm"
                >
                    Supprimer
                </button>
            </div>
        </div>
    );
}

export function DeleteModelButton({ id }: { id: number }) {
    return (
        <button
            onClick={() => deleteModel(id)}
            className="btn-danger"
        >
            Supprimer le modèle
        </button>
    )
}
