import React from 'react';
import { prisma } from '../../../lib/prisma';
import { VehiclesSection } from '../../components/VehiclesSection';
import { NavbarAndMenu } from '../../components/Menu';
import { ReservationSidebar } from '../../components/ReservationSidebar';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import '../../../styles/reservation.css';

// Force dynamic rendering because we use searchParams
export const dynamic = 'force-dynamic';

export default async function ReservationPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const t = await getTranslations('reservation');
    const resolvedSearchParams = await searchParams;

    // 1. Extraire les paramètres de recherche et filtres
    const { startDate, endDate, startTime, returnTime, transmission } = resolvedSearchParams;

    // 2. Construction de la condition de disponibilité (Dates)
    let dateFilter: any = {};
    if (startDate && endDate) {
        const startDateTime = new Date(`${startDate}T${startTime || '00:00'}:00`);
        const endDateTime = new Date(`${endDate}T${returnTime || '00:00'}:00`);

        dateFilter = {
            none: {
                status: {
                    in: ['CONFIRMED']
                },
                AND: [
                    { dateDebut: { lt: endDateTime } },
                    { dateFin: { gt: startDateTime } }
                ]
            }
        };
    }

    // 3. Construction des filtres supplémentaires (Transmission)
    const whereCondition: any = {
        vehicules: {
            some: {
                statut: 'DISPONIBLE',
                reservations: dateFilter
            }
        }
    };

    if (transmission) {
        // transmission can be "MANUELLE" or "MANUELLE,AUTOMATIQUE"
        const transmissionList = (Array.isArray(transmission) ? transmission : transmission.split(','))
            .map(t => t.toUpperCase().trim());

        // Prisma 'in' filter for Enum
        whereCondition.transmission = {
            in: transmissionList as any // Force cast if Type safety complaints
        };
    }

    // 4. Récupération des données
    const voitures = await prisma.modeleVoiture.findMany({
        where: whereCondition
    });

    const locations = await prisma.location.findMany();

    return (
        <>
            <NavbarAndMenu voitures={voitures} locations={locations} isOtherPage={true} />
            <div className="reservation-page">
                <div className="reservation-container">

                    {/* SIDEBAR GAUCHE */}
                    <ReservationSidebar locations={locations} />

                    {/* CONTENU PRINCIPAL DROITE */}
                    <div className="reservation-content">

                        <div className="reservation-header">
                            <h1 className="reservation-title">
                                {t('results_title')}
                            </h1>
                            <Link href="/" className="back-button">
                                <i className="fas fa-arrow-left"></i> {t('back')}
                            </Link>
                        </div>

                        {voitures.length === 0 ? (
                            <div className="no-results-container">
                                <div className="no-results-title">
                                    {t('no_vehicles')}
                                </div>
                                <p className="no-results-text">
                                    {t('no_vehicles_desc')}
                                </p>
                            </div>
                        ) : (
                            <VehiclesSection voitures={voitures} searchParams={resolvedSearchParams} />
                        )}
                    </div>
                </div>
            </div>

        </>
    );
}
