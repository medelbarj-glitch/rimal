import { PrismaClient } from '@prisma/client';
import { AdminLayout } from '@/app/admin/components/AdminLayout';
import { EditModelForm } from './EditModelForm';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
        notFound();
    }

    const modele = await prisma.modeleVoiture.findUnique({
        where: { id },
        include: { imagesModele: { orderBy: { ordre: 'asc' } } }
    });

    if (!modele) {
        notFound();
    }

    return (
        <AdminLayout title={`Modifier ${modele.nom}`}>
            <div className="admin-form-container">
                <EditModelForm modele={modele} />
            </div>
        </AdminLayout>
    );
}
