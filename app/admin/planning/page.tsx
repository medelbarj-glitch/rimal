export const dynamic = 'force-dynamic';

import { PrismaClient } from '@prisma/client';
import React, { Fragment } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay, isWithinInterval, parseISO, isWeekend, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function PlanningPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;
    const startDateParam = typeof resolvedSearchParams.startDate === 'string' ? resolvedSearchParams.startDate : undefined;

    // Determine the start date of the MONTH view
    const today = new Date();
    // Default to current month start
    let viewDate = startOfMonth(today);

    if (startDateParam) {
        try {
            viewDate = startOfMonth(parseISO(startDateParam));
        } catch (e) {
            // If invalid, fallback
        }
    }

    const viewEnd = endOfMonth(viewDate);
    const days = eachDayOfInterval({ start: viewDate, end: viewEnd });

    // Navigation handlers
    const prevMonth = subMonths(viewDate, 1);
    const nextMonth = addMonths(viewDate, 1);
    const prevMonthUrl = `/admin/planning?startDate=${format(prevMonth, 'yyyy-MM-dd')}`;
    const nextMonthUrl = `/admin/planning?startDate=${format(nextMonth, 'yyyy-MM-dd')}`;
    const currentMonthUrl = `/admin/planning?startDate=${format(startOfMonth(today), 'yyyy-MM-dd')}`;

    // Fetch Data
    const vehicles = await prisma.vehicule.findMany({
        where: {
            statut: { not: 'RETIRE' }
        },
        include: {
            modele: true
        },
        orderBy: {
            modele: {
                nom: 'asc'
            }
        }
    });

    const reservations = await prisma.reservation.findMany({
        where: {
            status: { not: 'CANCELLED' },
            AND: [
                { dateDebut: { lte: viewEnd } },
                { dateFin: { gte: viewDate } }
            ]
        }
    });

    const getReservationsForVehicleAndDay = (vehicleId: number, day: Date) => {
        return reservations.filter(r => {
            if (r.vehiculeId !== vehicleId) return false;
            const start = startOfDay(r.dateDebut);
            const end = startOfDay(r.dateFin);
            return day.getTime() >= start.getTime() && day.getTime() <= end.getTime();
        }).sort((a, b) => a.dateDebut.getTime() - b.dateDebut.getTime());
    };

    return (
        <AdminLayout title="Planning Mensuel">
            <div className="planning-controls">
                <Link href={prevMonthUrl} className="nav-btn">
                    <i className="fas fa-chevron-left"></i> Précédent
                </Link>

                <span className="current-week-label">
                    {format(viewDate, 'MMMM yyyy', { locale: fr })}
                </span>

                <Link href={nextMonthUrl} className="nav-btn">
                    Suivant <i className="fas fa-chevron-right"></i>
                </Link>

                <Link href={currentMonthUrl} className="nav-btn today-btn">
                    Aujourd'hui
                </Link>
            </div>

            <div className="planning-container">
                <div className="planning-grid" style={{ gridTemplateColumns: `var(--planning-first-col, minmax(140px, auto)) repeat(${days.length}, minmax(25px, 1fr))` }}>
                    {/* Header Row */}
                    <div className="planning-header-cell empty-corner">Véhicule</div>
                    {days.map(day => (
                        <div key={day.toISOString()} className={`planning-header-cell day-header ${isSameDay(day, today) ? 'today' : ''} ${isWeekend(day) ? 'weekend' : ''}`}>
                            <span className="day-name">{format(day, 'EEE', { locale: fr })}</span>
                            <span className="day-number">{format(day, 'd', { locale: fr })}</span>
                        </div>
                    ))}

                    {/* Rows */}
                    {vehicles.map(vehicle => (
                        <Fragment key={`vehicle-group-${vehicle.id}`}>
                            <div className="planning-row-header">
                                <div className="vehicle-info-wrapper">
                                    {vehicle.modele.imageUrl && (
                                        <img src={vehicle.modele.imageUrl} alt={vehicle.modele.nom} className="planning-vehicle-img" />
                                    )}
                                    <div className="vehicle-text">
                                        <span className="vehicle-name">{vehicle.modele.nom}</span>
                                        <span className="vehicle-plaque">{vehicle.plaque}</span>
                                    </div>
                                </div>
                            </div>

                            {days.map(day => {
                                const dayReservations = getReservationsForVehicleAndDay(vehicle.id, day);

                                return (
                                    <div
                                        key={`cell-${vehicle.id}-${day.toISOString()}`}
                                        className={`planning-cell ${isWeekend(day) ? 'weekend-cell' : ''} ${isSameDay(day, today) ? 'is-today' : ''}`}
                                    >
                                        {dayReservations.map(res => {
                                            const isVisible = res.status === 'PENDING' || res.status === 'CONFIRMED';
                                            if (!isVisible) return null;

                                            const isStart = isSameDay(day, res.dateDebut);
                                            const isEnd = isSameDay(day, res.dateFin);

                                            return (
                                                <div
                                                    key={`pill-${res.id}`}
                                                    className={`planning-pill-wrapper ${isStart ? 'res-start' : ''} ${isEnd ? 'res-end' : ''} ${res.status.toLowerCase()}`}
                                                >
                                                    <div className="planning-pill">


                                                        <div className="planning-tooltip">
                                                            <span className="tooltip-title">Détails Réservation</span>
                                                            <div className="tooltip-row">
                                                                <i className="fas fa-user"></i> {res.clientPrenom} {res.clientNom}
                                                            </div>
                                                            <div className="tooltip-row">
                                                                <i className="fas fa-calendar-alt"></i> {format(res.dateDebut, 'dd/MM')} au {format(res.dateFin, 'dd/MM')}
                                                            </div>
                                                            <div className="tooltip-row">
                                                                <i className="fas fa-phone"></i> {res.clientTel}
                                                            </div>
                                                            <div className="tooltip-row">
                                                                <i className="fas fa-info-circle"></i> {res.status}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </Fragment>
                    ))}
                </div>
            </div>

            {vehicles.length === 0 && (
                <p className="reservations-empty">Aucun véhicule actif à afficher.</p>
            )}
        </AdminLayout>
    );
}
