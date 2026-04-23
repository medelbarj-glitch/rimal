import { PrismaClient } from '@prisma/client';
import { AdminLayout } from '@/app/admin/components/AdminLayout';
import { EditModelForm } from './EditModelForm';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function EditVehiclePage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        notFound();
    }

    const modele = await prisma.modeleVoiture.findUnique({
        where: { id },
        include: { imagesModele: true }
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
