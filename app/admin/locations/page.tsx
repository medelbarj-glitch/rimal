import { PrismaClient } from '@prisma/client';
import { AddLocationForm, LocationItem } from './forms';
import { AdminLayout } from '../components/AdminLayout';

const prisma = new PrismaClient();

export default async function LocationsPage() {
    const locations = await prisma.location.findMany({
        orderBy: {
            nom: 'asc',
        },
    });

    return (
        <AdminLayout title="Gestion des Lieux">
            <div className="admin-form-container">
                <h2 className="locations-title">Ajouter un Lieu</h2>
                <AddLocationForm />
            </div>

            <div className="data-grid">
                <h2 className="locations-subtitle">Lieux Enregistrés ({locations.length})</h2>

                {locations.length === 0 ? (
                    <p className="locations-empty">Aucun lieu enregistré.</p>
                ) : (
                    locations.map((loc) => (
                        <LocationItem key={loc.id} location={loc} />
                    ))

                )}
            </div>
        </AdminLayout>
    );
}