import React from 'react';
import { prisma } from '../../../../lib/prisma';
import { BookingForm } from '../../../components/BookingForm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import '../../../../styles/booking.css'; // Import custom styles
import { NavbarAndMenu } from '../../../components/Menu';
import { getTranslations } from 'next-intl/server';

export default async function BookingPage({
    params,
    searchParams,
}: {
    params: Promise<{ modelId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { modelId: modelIdStr } = await params;
    const resolvedSearchParams = await searchParams;

    const modelId = parseInt(modelIdStr);
    if (isNaN(modelId)) return notFound();

    const model = await prisma.modeleVoiture.findUnique({
        where: { id: modelId },
    });

    if (!model) return notFound();

    // Calculate estimated price
    const startDateStr = resolvedSearchParams.startDate as string;
    const endDateStr = resolvedSearchParams.endDate as string;
    let totalPrice = 0;
    let days = 0;

    if (startDateStr && endDateStr) {
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalPrice = days * model.prixParJour;
    }

    const locations = await prisma.location.findMany();

    const voitures = await prisma.modeleVoiture.findMany();
    const settings = await prisma.setting.findUnique({ where: { id: 1 } });
    const logoUrl = settings?.logoUrl || '/default-logo.png';

    return (
        <>
            <NavbarAndMenu voitures={voitures} locations={locations} isOtherPage={true} logoUrl={logoUrl} />
            <div className="booking-page">
                <div className="booking-container">
                    <BookingForm
                        modelId={modelId}
                        modelName={model.nom}
                        modelImageUrl={model.imageUrl}
                        searchParams={resolvedSearchParams}
                        locations={locations}
                        pricePerDay={model.prixParJour}
                    />
                </div>
            </div>
        </>
    );
}
