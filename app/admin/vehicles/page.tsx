import { PrismaClient } from '@prisma/client';
import { AddModelForm } from './forms';
import { AdminLayout } from '../components/AdminLayout';
import { VehicleModelRow } from './VehicleModelRow';

const prisma = new PrismaClient();

export default async function VehiclesPage() {
    const modeles = await prisma.modeleVoiture.findMany({
        include: {
            vehicules: true,
            imagesModele: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <AdminLayout title="Gestion de la Flotte">
            <div className="admin-form-container">
                <h2 className="admin-section-title">Ajouter un Modèle</h2>
                <AddModelForm />
            </div>

            <div className="data-grid">
                <h2 className="admin-section-title">Modèles Existants ({modeles.length})</h2>

                {modeles.length === 0 ? (
                    <p className="admin-empty-text">Aucun modèle de voiture n'a été ajouté.</p>
                ) : (
                    modeles.map((modele) => (
                        <VehicleModelRow key={modele.id} modele={modele} />
                    ))
                )}
            </div>
        </AdminLayout>
    );
}
