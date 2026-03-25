export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { AdminLayout } from './components/AdminLayout';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function AdminDashboard() {
    const [vehicleCount, locationCount, reservationCount] = await Promise.all([
        prisma.vehicule.count(),
        prisma.location.count(),
        prisma.reservation.count(),
    ]);

    return (
        <AdminLayout title="Tableau de Bord">
            <div className="dashboard-grid">
                <Link href="/admin/vehicles" className="dashboard-card">
                    <div>
                        <h3>Gestion des Véhicules</h3>
                        <p>Ajoutez des modèles, gérez le stock et les statuts des véhicules.</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{vehicleCount}</p>
                    </div>
                    <span className="card-link">Gérer les véhicules &rarr;</span>
                </Link>

                <Link href="/admin/locations" className="dashboard-card">
                    <div>
                        <h3>Lieux de Retrait</h3>
                        <p>Configurez les agences et points de retrait disponibles.</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{locationCount}</p>
                    </div>
                    <span className="card-link">Gérer les lieux &rarr;</span>
                </Link>

                <Link href="/admin/reservations" className="dashboard-card">
                    <div>
                        <h3>Réservations</h3>
                        <p>Visualisez et gérez les réservations clients.</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{reservationCount}</p>
                    </div>
                    <span className="card-link">Gérer les réservations &rarr;</span>
                </Link>

                <Link href="/admin/style" className="dashboard-card">
                    <div>
                        <h3>Style & Backgrounds</h3>
                        <p>Gérez les images d'arrière-plan du site.</p>
                    </div>
                    <span className="card-link">Personnaliser &rarr;</span>
                </Link>

                <Link href="/admin/settings" className="dashboard-card">
                    <div>
                        <h3>Paramètres Généraux</h3>
                        <p>Gérez le logo du site et le numéro de téléphone.</p>
                    </div>
                    <span className="card-link">Configurer &rarr;</span>
                </Link>
            </div>
        </AdminLayout>
    );
}
