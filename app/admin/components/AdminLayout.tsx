"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ToastProvider } from './ToastContext';
import { logoutAction } from '../login/actions';
import '../admin.css'; // Ensure CSS is loaded

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const isActive = (path: string) => {
        return pathname === path ? 'active' : '';
    };

    return (
        <ToastProvider>
            <div className="admin-layout">
                {/* Mobile Toggle Button */}
                <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>

                {/* Sidebar Overlay */}
                {isSidebarOpen && (
                    <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
                )}

                {/* Sidebar */}
                <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <h2>BOUDERBA</h2>
                        <span>Admin Panel</span>
                        <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <nav className="sidebar-nav">
                        <Link href="/admin" className={`nav-item ${isActive('/admin')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-home"></i> Tableau de bord
                        </Link>
                        <Link href="/admin/reservations" className={`nav-item ${isActive('/admin/reservations')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-calendar-alt"></i> Réservations
                        </Link>
                        <Link href="/admin/planning" className={`nav-item ${isActive('/admin/planning')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-calendar-week"></i> Planning
                        </Link>
                        <Link href="/admin/vehicles" className={`nav-item ${isActive('/admin/vehicles')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-car"></i> Véhicules
                        </Link>
                        <Link href="/admin/pricing" className={`nav-item ${isActive('/admin/pricing')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-tags"></i> Tarification
                        </Link>
                        <Link href="/admin/locations" className={`nav-item ${isActive('/admin/locations')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-map-marker-alt"></i> Lieux
                        </Link>
                        <Link href="/admin/options" className={`nav-item ${isActive('/admin/options')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-puzzle-piece"></i> Options
                        </Link>
                        <Link href="/admin/style" className={`nav-item ${isActive('/admin/style')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-paint-brush"></i> Style
                        </Link>
                        <Link href="/admin/settings" className={`nav-item ${isActive('/admin/settings')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-cogs"></i> Paramètres
                        </Link>
                        <Link href="/" className="nav-item return-site">
                            <i className="fas fa-arrow-left"></i> Retour au site
                        </Link>
                        <button onClick={async () => { await logoutAction(); router.push('/admin/login'); }} className="nav-item return-site" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', marginTop: '1rem' }}>
                            <i className="fas fa-sign-out-alt"></i> Déconnexion
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="admin-content">
                    <header className="admin-header">
                        <div className="header-left">
                            <h1>{title}</h1>
                        </div>
                        <div className="admin-user">
                            <span>Admin</span>
                        </div>
                    </header>
                    <main className="admin-page-content">
                        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}
