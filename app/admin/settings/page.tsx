'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { useToast } from '../components/ToastContext';
import '../styles/admin-forms.css';
import '../styles/admin-layout.css';

function SettingsForm() {
    const { showToast } = useToast();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                setPhoneNumber(data.phoneNumber || '');
                if (data.logoUrl) {
                    setLogoPreview(data.logoUrl);
                }
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            showToast('Erreur lors du chargement des paramètres', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            const formData = new FormData(e.currentTarget);
            
            const req = await fetch('/api/settings', {
                method: 'POST',
                body: formData,
            });

            if (req.ok) {
                showToast('Paramètres mis à jour avec succès', 'success');
                fetchSettings(); // Refresh to get the updated logo URL
            } else {
                showToast('Erreur lors de la sauvegarde', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Erreur réseau lors de la sauvegarde', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="admin-form-container">
            <div className="admin-header-actions">
                <h2 className='component-title'>Configuration</h2>
            </div>

            {isLoading ? (
                <div className="loading-spinner">Chargement des paramètres...</div>
            ) : (
                <form onSubmit={handleFormSubmit} className="admin-form" encType="multipart/form-data">
                    <div className="form-group">
                        <label htmlFor="phoneNumber" className='component-subtitle'>Numéro de Téléphone</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+212 6 XX XX XX XX"
                            required
                        />
                        <p className="form-help">Ce numéro sera utilisé pour WhatsApp et sur la page de contact.</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="logo" className='component-subtitle'>Logo du Site</label>
                        <br></br>
                        <input 
                            type="file" 
                            className="upload-files"
                            id="logo" 
                            name="logo" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                        />
                        <p className="form-help">Formats supportés: PNG, JPG, SVG.</p>
                        
                        {logoPreview && (
                            <div className="image-preview" style={{ marginTop: '15px' }}>
                                <p>Aperçu du logo actuel :</p>
                                <div style={{ maxWidth: '200px', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={logoPreview} alt="Logo Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="admin-submit-btn" disabled={isSaving}>
                            {isSaving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function GeneralSettings() {
    return (
        <AdminLayout title="Paramètres Généraux">
            <SettingsForm />
        </AdminLayout>
    );
}
