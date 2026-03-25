"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ToastProvider } from './ToastContext';
import '../admin.css'; // Ensure CSS is loaded

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
    const pathname = usePathname();

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
                        <Link href="/admin/locations" className={`nav-item ${isActive('/admin/locations')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-map-marker-alt"></i> Lieux
                        </Link>
                        <Link href="/admin/style" className={`nav-item ${isActive('/admin/style')}`} onClick={() => setIsSidebarOpen(false)}>
                            <i className="fas fa-paint-brush"></i> Style
                        </Link>
                        <Link href="/" className="nav-item return-site">
                            <i className="fas fa-arrow-left"></i> Retour au site
                        </Link>
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
