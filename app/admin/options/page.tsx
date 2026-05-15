import { PrismaClient } from '@prisma/client';
import { AdminLayout } from '../components/AdminLayout';
import { AddOptionForm, OptionItem } from './forms';

const prisma = new PrismaClient();

export default async function OptionsPage() {
    const options = await prisma.optionReservation.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <AdminLayout title="Options de Réservation">
            <div className="admin-form-container">
                <h2 className="locations-title">Ajouter une Option</h2>
                <AddOptionForm />
            </div>

            <div className="data-grid">
                <h2 className="locations-subtitle">Options Disponibles ({options.length})</h2>

                {options.length === 0 ? (
                    <p className="locations-empty">Aucune option enregistrée.</p>
                ) : (
                    options.map((opt) => (
                        <OptionItem key={opt.id} option={opt} />
                    ))
                )}
            </div>
        </AdminLayout>
    );
}
