'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { useToast } from '../components/ToastContext';
import { getSettings, updateSettings } from '@/app/actions/settingsActions';
import { ImageFileInput } from '../components/ImageFileInput';
import '../styles/admin-forms.css';

function SettingsForm() {
    const { showToast } = useToast();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getSettings();
        if (data) {
            setPhoneNumber(data.phoneNumber || '');
            setLogoPreview(data.logoUrl || null);
        }
        setIsLoading(false);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData(e.currentTarget);
            await updateSettings(formData);
            showToast('Paramètres enregistrés sur Cloudinary !', 'success');
        } catch (error) {
            showToast('Erreur lors de la sauvegarde', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="admin-form-container">
            <h2 className='component-title'>Configuration Générale</h2>
            {isLoading ? <p>Chargement...</p> : (
                <form onSubmit={handleFormSubmit} className="admin-form" encType="multipart/form-data">
                    <div className="form-group">
                        <label className='component-subtitle'>Numéro WhatsApp</label>
                        <input 
                            name="phoneNumber" 
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className='component-subtitle'>Logo (Cloudinary)</label>
                        <ImageFileInput 
                            name="logo" 
                            accept="image/*" 
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setLogoPreview(URL.createObjectURL(file));
                                else setLogoPreview(null);
                            }} 
                        />
                        {logoPreview && <img src={logoPreview} alt="Logo" style={{ width: '150px', marginTop: '10px' }} />}
                    </div>

                    <button type="submit" className="admin-submit-btn" disabled={isSaving}>
                        {isSaving ? 'Enregistrement...' : 'Sauvegarder'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function GeneralSettings() {
    return <AdminLayout title="Paramètres"><SettingsForm /></AdminLayout>;
}