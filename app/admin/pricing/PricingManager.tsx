'use client';

import { useState } from 'react';
import { ModeleVoiture, PrixSaisonnier } from '@prisma/client';
import { addPrixSaisonnier, deletePrixSaisonnier } from '../../actions/pricing';
import { format } from 'date-fns';

interface PricingManagerProps {
    modele: ModeleVoiture & { prixSaisonniers: PrixSaisonnier[] };
}

export function PricingManager({ modele }: PricingManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [nom, setNom] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [prixParJour, setPrixParJour] = useState<number | ''>('');

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await addPrixSaisonnier({
            modeleId: modele.id,
            nom,
            dateDebut: new Date(dateDebut),
            dateFin: new Date(dateFin),
            prixParJour: Number(prixParJour)
        });

        setIsLoading(false);

        if (result.success) {
            setIsAdding(false);
            setNom('');
            setDateDebut('');
            setDateFin('');
            setPrixParJour('');
        } else {
            alert(result.error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette saison ?')) return;

        const result = await deletePrixSaisonnier(id);
        if (!result.success) {
            alert(result.error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 className="stock-title" style={{ margin: 0 }}>
                    Saisons Configuées ({modele.prixSaisonniers.length})
                </h4>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                >
                    {isAdding ? 'Annuler' : '+ Ajouter une saison'}
                </button>
            </div>

            {isAdding && (
                <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #ddd' }}>
                    <form onSubmit={handleAdd} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>Nom de la saison</label>
                            <input 
                                type="text" 
                                required 
                                value={nom} 
                                onChange={(e) => setNom(e.target.value)} 
                                placeholder="Ex: Haute saison été" 
                                style={{ padding: '8px' }}
                            />
                        </div>
                        <div className="form-group" style={{ flex: '1 1 150px', marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>Date de début</label>
                            <input 
                                type="date" 
                                required 
                                value={dateDebut} 
                                onChange={(e) => setDateDebut(e.target.value)} 
                                style={{ padding: '8px' }}
                            />
                        </div>
                        <div className="form-group" style={{ flex: '1 1 150px', marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>Date de fin</label>
                            <input 
                                type="date" 
                                required 
                                value={dateFin} 
                                onChange={(e) => setDateFin(e.target.value)} 
                                style={{ padding: '8px' }}
                            />
                        </div>
                        <div className="form-group" style={{ flex: '1 1 120px', marginBottom: 0 }}>
                            <label style={{ fontSize: '0.8rem' }}>Prix (DH/jour)</label>
                            <input 
                                type="number" 
                                required 
                                min="0" 
                                value={prixParJour} 
                                onChange={(e) => setPrixParJour(Number(e.target.value))} 
                                style={{ padding: '8px' }}
                            />
                        </div>
                        <button type="submit" disabled={isLoading} className="btn-primary" style={{ padding: '8px 15px', height: 'fit-content' }}>
                            {isLoading ? '...' : 'Enregistrer'}
                        </button>
                    </form>
                </div>
            )}

            {modele.prixSaisonniers.length === 0 ? (
                <p className="stock-empty" style={{ fontSize: '0.9rem', color: '#888' }}>Aucune saison spécifique configurée pour ce modèle.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {modele.prixSaisonniers.map((saison) => (
                        <div key={saison.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px 15px', borderRadius: '5px', border: '1px solid #eee' }}>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '4px', color: '#333' }}>{saison.nom}</strong>
                                <span style={{ fontSize: '0.85rem', color: '#666' }}>
                                    Du {format(new Date(saison.dateDebut), 'dd/MM/yyyy')} au {format(new Date(saison.dateFin), 'dd/MM/yyyy')}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span className="model-price" style={{ fontSize: '1.1rem' }}>{saison.prixParJour} DH/j</span>
                                <button
                                    onClick={() => handleDelete(saison.id)}
                                    style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '5px' }}
                                    title="Supprimer"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
