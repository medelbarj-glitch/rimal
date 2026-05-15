import { prisma } from '../../../lib/prisma';
import { AdminLayout } from '../components/AdminLayout';
import { PricingManager } from './PricingManager';

export default async function PricingPage() {
    // We need model names and their current prices, plus their seasonal prices
    const modeles = await prisma.modeleVoiture.findMany({
        include: {
            prixSaisonniers: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <AdminLayout title="Gestion des Tarifs">
            <div className="data-grid">
                <h2 className="admin-section-title">Tarification par Modèle</h2>
                <p className="admin-subtitle" style={{ marginBottom: '20px', color: '#666' }}>
                    Le prix par jour par défaut est utilisé si aucune saison ne correspond aux dates de réservation.
                    Le prix saisonnier est calculé au prorata des jours concernés (ex: 2 jours basse saison, 3 jours haute saison).
                </p>

                {modeles.length === 0 ? (
                    <p className="admin-empty-text">Aucun modèle de voiture n'a été ajouté.</p>
                ) : (
                    modeles.map((modele) => (
                        <div key={modele.id} className="data-item model-row" style={{ marginBottom: '30px' }}>
                            <div className="model-header" style={{ borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                                <div className="model-main-info">
                                    {modele.imageUrl && (
                                        <img src={modele.imageUrl} alt={modele.nom} className="model-image" style={{ width: '80px', height: 'auto', borderRadius: '5px' }} />
                                    )}
                                    <div>
                                        <h3 className="model-title" style={{ margin: '0 0 5px 0' }}>
                                            {modele.nom} 
                                            <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: '#666', marginLeft: '10px' }}>
                                                ({modele.fuelType} - {modele.transmission})
                                            </span>
                                        </h3>
                                        <p className="model-details" style={{ margin: 0 }}>
                                            Prix de base par défaut : <strong className="model-price">{modele.prixParJour} DH/jour</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="stock-section" style={{ padding: '20px' }}>
                                <PricingManager modele={modele} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AdminLayout>
    );
}
