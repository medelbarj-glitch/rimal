export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { AdminLayout } from './components/AdminLayout';
import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const prisma = new PrismaClient();

export default async function AdminDashboard() {
    const now = new Date();

    const [
        vehicleCount,
        locationCount,
        reservationCount,
        pendingCount,
        activeRentalsCount,
        recentReservations
    ] = await Promise.all([
        prisma.vehicule.count(),
        prisma.location.count(),
        prisma.reservation.count(),
        prisma.reservation.count({
            where: { status: 'PENDING' }
        }),
        prisma.reservation.count({
            where: {
                status: 'CONFIRMED',
                dateDebut: { lte: now },
                dateFin: { gte: now }
            }
        }),
        prisma.reservation.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                vehicule: {
                    include: { modele: true }
                }
            }
        })
    ]);

    return (
        <AdminLayout title="Tableau de Bord">
            <div className="dashboard-container">
                {/* Header Section */}
                <div className="dashboard-header">
                    <h2>Bienvenue, Administrateur</h2>
                    <p>Voici un résumé de l'activité de votre agence de location aujourd'hui.</p>
                </div>

                {/* Stats Row */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fas fa-car"></i></div>
                        <div className="stat-details">
                            <h3>Total Véhicules</h3>
                            <p className="stat-value">{vehicleCount}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon warning"><i className="fas fa-clock"></i></div>
                        <div className="stat-details">
                            <h3>Demandes en attente</h3>
                            <p className="stat-value">{pendingCount}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon success"><i className="fas fa-key"></i></div>
                        <div className="stat-details">
                            <h3>Locations en cours</h3>
                            <p className="stat-value">{activeRentalsCount}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon info"><i className="fas fa-calendar-check"></i></div>
                        <div className="stat-details">
                            <h3>Total Réservations</h3>
                            <p className="stat-value">{reservationCount}</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-content-grid">
                    {/* Recent Activity Table */}
                    <div className="recent-activity-section">
                        <div className="section-header">
                            <h3>Activité Récente</h3>
                            <Link href="/admin/reservations" className="view-all-link">Voir tout &rarr;</Link>
                        </div>
                        <div className="recent-activity-table-wrapper">
                            <table className="recent-activity-table">
                                <thead>
                                    <tr>
                                        <th>Client</th>
                                        <th>Véhicule</th>
                                        <th>Dates</th>
                                        <th>Statut</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentReservations.length === 0 ? (
                                        <tr><td colSpan={5} className="empty-state">Aucune activité récente.</td></tr>
                                    ) : (
                                        recentReservations.map(res => (
                                            <tr key={res.id}>
                                                <td>
                                                    <strong>{res.clientPrenom} {res.clientNom}</strong><br />
                                                    <span className="client-phone">{res.clientTel}</span>
                                                </td>
                                                <td>
                                                    <div className="vehicle-cell">
                                                        <span>{res.vehicule.modele.nom}</span>
                                                        <span className="vehicle-plate">{res.vehicule.plaque}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    {format(new Date(res.dateDebut), 'dd/MM/yyyy')} <br/>
                                                    <i className="fas fa-arrow-down text-xs" style={{color: '#ccc', margin: '2px 0'}}></i><br/>
                                                    {format(new Date(res.dateFin), 'dd/MM/yyyy')}
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${res.status.toLowerCase()}`}>
                                                        {res.status === 'PENDING' ? 'En attente' :
                                                         res.status === 'CONFIRMED' ? 'Confirmée' : 
                                                         res.status === 'COMPLETED' ? 'Terminée' :
                                                         res.status === 'CANCELLED' ? 'Annulée' : res.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link href="/admin/reservations" className="action-link">
                                                        <i className="fas fa-eye"></i>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Links Grid */}
                    <div className="quick-links-section">
                        <div className="section-header">
                            <h3>Accès Rapides</h3>
                        </div>
                        <div className="quick-links-grid">
                            <Link href="/admin/planning" className="quick-link-card">
                                <div className="ql-icon"><i className="fas fa-calendar-alt"></i></div>
                                <span>Planning Mensuel</span>
                                <i className="fas fa-chevron-right ql-arrow"></i>
                            </Link>
                            <Link href="/admin/vehicles" className="quick-link-card">
                                <div className="ql-icon"><i className="fas fa-car"></i></div>
                                <span>Flotte Automobile</span>
                                <i className="fas fa-chevron-right ql-arrow"></i>
                            </Link>
                            <Link href="/admin/locations" className="quick-link-card">
                                <div className="ql-icon"><i className="fas fa-map-marker-alt"></i></div>
                                <span>Lieux & Agences</span>
                                <i className="fas fa-chevron-right ql-arrow"></i>
                            </Link>
                            <Link href="/admin/style" className="quick-link-card">
                                <div className="ql-icon"><i className="fas fa-paint-brush"></i></div>
                                <span>Personnalisation</span>
                                <i className="fas fa-chevron-right ql-arrow"></i>
                            </Link>
                            <Link href="/admin/settings" className="quick-link-card">
                                <div className="ql-icon"><i className="fas fa-cog"></i></div>
                                <span>Paramètres</span>
                                <i className="fas fa-chevron-right ql-arrow"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
