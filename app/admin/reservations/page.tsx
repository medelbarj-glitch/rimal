export const dynamic = 'force-dynamic';

import { PrismaClient } from '@prisma/client';
import { AdminLayout } from '../components/AdminLayout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ReservationActions } from './ReservationActions';
import { EditReservationModal } from './EditReservationModal';
import { CreateReservationModal } from './CreateReservationModal';
import { PriceRecapButton } from './PriceRecapButton';

const prisma = new PrismaClient();

export default async function ReservationsPage() {
    const reservations = await prisma.reservation.findMany({
        include: {
            vehicule: {
                include: {
                    modele: {
                        include: { prixSaisonniers: true }
                    },
                },
            },
            lieuPriseEnCharge: true,
            lieuRetour: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const vehicles = await prisma.vehicule.findMany({
        include: {
            modele: true,
            reservations: {
                select: {
                    id: true,
                    dateDebut: true,
                    dateFin: true,
                    status: true,
                    clientNom: true,
                    clientPrenom: true,
                }
            }
        },
        orderBy: {
            plaque: 'asc',
        },
    });

    const locations = await prisma.location.findMany();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD',
        }).format(price);
    };

    const formatDate = (date: Date) => {
        return format(date, 'dd MMM yyyy', { locale: fr });
    };

    const getStatusBadge = (status: string) => {
        let badgeClass = 'status-badge';

        switch (status) {
            case 'PENDING':
                badgeClass += ' pending';
                break;
            case 'CONFIRMED':
                badgeClass += ' confirmed';
                break;
            case 'REJECTED':
            case 'CANCELLED':
                badgeClass += ' cancelled';
                break;
            case 'COMPLETED':
                badgeClass += ' completed';
                break;
            case 'EXPIRED':
                badgeClass += ' expired';
                break;
            default:
                badgeClass += ' pending';
        }

        return (
            <span className={badgeClass}>
                {status}
            </span>
        );
    };

    return (
        <AdminLayout title="Gestion des Réservations">
            <div className="data-grid">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className="reservations-title" style={{ margin: 0 }}>
                        Toutes les Réservations ({reservations.length})
                    </h2>
                    <CreateReservationModal locations={locations} vehicles={vehicles} />
                </div>

                {reservations.length === 0 ? (
                    <p className="reservations-empty">Aucune réservation trouvée.</p>
                ) : (
                    <div className="data-grid">
                        {reservations.map((res) => (
                            <div key={res.id} className="data-item">
                                <div className="data-item-content">
                                    {/* Vehicle Image */}
                                    {res.vehicule.modele.imageUrl && (
                                        <img
                                            src={res.vehicule.modele.imageUrl}
                                            alt={res.vehicule.modele.nom}
                                        />
                                    )}

                                    {/* Reservation Info */}
                                    <div className="data-info flex-1">
                                        <div className="reservation-header">
                                            <h3 className="reservation-title">
                                                {res.vehicule.modele.nom} <span className="reservation-subtitle">({res.vehicule.plaque})</span>
                                            </h3>
                                            <span className="reservation-price">{formatPrice(res.prixTotal)}</span>
                                        </div>

                                        <div className="reservation-details-grid">
                                            <div>
                                                <div className="info-row"><i className="fas fa-calendar-alt info-icon"></i> {formatDate(res.dateDebut)} - {formatDate(res.dateFin)}</div>
                                                <div className="info-row">
                                                    <i className="fas fa-map-marker-alt info-icon"></i>
                                                    {res.lieuPriseEnCharge ? res.lieuPriseEnCharge.nom : <span style={{ color: '#B49339', fontWeight: 'bold' }}>{res.customPriseEnCharge || 'Adresse Personnalisée'}</span>}
                                                    <i className="fas fa-arrow-right reservation-arrow"></i>
                                                    {res.lieuRetour ? res.lieuRetour.nom : <span style={{ color: '#B49339', fontWeight: 'bold' }}>{res.customRetour || 'Même adresse'}</span>}
                                                </div>
                                                {res.note ? <div className="info-row"><i className="fa-regular fa-note-sticky info-icon"></i> {res.note}</div> : null}
                                            </div>
                                            <div>
                                                <div className="client-name"><i className="fas fa-user info-icon"></i> {res.clientPrenom} {res.clientNom}</div>
                                                <div className="info-row"><i className="fas fa-phone info-icon"></i> {res.clientTel}</div>
                                                <div className="info-row"><i className="fas fa-envelope info-icon"></i> {res.clientEmail}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="data-actions vertical">
                                    {getStatusBadge(res.status)}
                                    <div className="action-buttons">
                                        <EditReservationModal reservation={res} locations={locations} vehicles={vehicles} />
                                        <PriceRecapButton reservation={res} />
                                        <ReservationActions id={res.id} currentStatus={res.status} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
                }
            </div >
        </AdminLayout >
    );
}
