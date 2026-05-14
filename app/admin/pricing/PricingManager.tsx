'use client';

import { useState } from 'react';
import { ModeleVoiture, PrixSaisonnier } from '@prisma/client';
import { addPrixSaisonnier, deletePrixSaisonnier, updatePromotion } from '../../actions/pricing';
import { format } from 'date-fns';

interface PricingManagerProps {
    modele: ModeleVoiture & { prixSaisonniers: PrixSaisonnier[] };
}

export function PricingManager({ modele }: PricingManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPromoLoading, setIsPromoLoading] = useState(false);

    // Form state pour les saisons
    const [nom, setNom] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [prixParJour, setPrixParJour] = useState<number | ''>('');

    // Form state pour la promotion
    const [promoActive, setPromoActive] = useState(modele.promotionActive);
    const [promoDebut, setPromoDebut] = useState(modele.promotionDateDebut ? new Date(modele.promotionDateDebut).toISOString().split('T')[0] : '');
    const [promoFin, setPromoFin] = useState(modele.promotionDateFin ? new Date(modele.promotionDateFin).toISOString().split('T')[0] : '');
    const [promoPrix, setPromoPrix] = useState<number | ''>(modele.promotionPrixParJour || '');

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

    const handleSavePromo = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPromoLoading(true);
        const result = await updatePromotion({
            modeleId: modele.id,
            promotionActive: promoActive,
            promotionDateDebut: promoDebut ? new Date(promoDebut) : null,
            promotionDateFin: promoFin ? new Date(promoFin) : null,
            promotionPrixParJour: promoPrix !== '' ? Number(promoPrix) : null
        });
        setIsPromoLoading(false);
        if (!result.success) {
            alert(result.error);
        } else {
            alert('Promotion enregistrée avec succès !');
        }
    };

    return (
        <div>
            {/* --- Section Promotion --- */}
            <div style={{ marginBottom: '30px', padding: '15px', background: promoActive ? '#fff0f5' : '#f9f9f9', border: promoActive ? '1px solid #ff1493' : '1px solid #ddd', borderRadius: '8px' }}>
                <h4 className="stock-title" style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-tags" style={{ color: promoActive ? '#ff1493' : '#666' }}></i> Promotion Spéciale
                </h4>
                <form onSubmit={handleSavePromo} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Activer la promo</label>
                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                            <input 
                                type="checkbox" 
                                checked={promoActive} 
                                onChange={(e) => setPromoActive(e.target.checked)} 
                                style={{ opacity: 0, width: 0, height: 0 }} 
                            />
                            <span className="slider round" style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: promoActive ? '#ff1493' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
                                <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: promoActive ? '30px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                            </span>
                        </label>
                    </div>

                    <div className="form-group" style={{ flex: '1 1 150px', marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Date de début</label>
                        <input 
                            type="date" 
                            required={promoActive} 
                            value={promoDebut} 
                            onChange={(e) => setPromoDebut(e.target.value)} 
                            style={{ padding: '8px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div className="form-group" style={{ flex: '1 1 150px', marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Date de fin</label>
                        <input 
                            type="date" 
                            required={promoActive} 
                            value={promoFin} 
                            onChange={(e) => setPromoFin(e.target.value)} 
                            style={{ padding: '8px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div className="form-group" style={{ flex: '1 1 120px', marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Prix (DH/jour)</label>
                        <input 
                            type="number" 
                            required={promoActive} 
                            min="0" 
                            value={promoPrix} 
                            onChange={(e) => setPromoPrix(Number(e.target.value))} 
                            style={{ padding: '8px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <button type="submit" disabled={isPromoLoading} className="btn-primary" style={{ padding: '8px 20px', height: 'fit-content', background: promoActive ? '#ff1493' : '', borderColor: promoActive ? '#ff1493' : '' }}>
                        {isPromoLoading ? '...' : 'Enregistrer'}
                    </button>
                </form>
            </div>

            {/* --- Section Saisons --- */}
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
