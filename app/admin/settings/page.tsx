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
    const [phoneNumber2, setPhoneNumber2] = useState('');
    
    // Heures d'ouverture
    const [hours, setHours] = useState({
        monday: '09:00 — 20:00',
        tuesday: '09:00 — 20:00',
        wednesday: '09:00 — 20:00',
        thursday: '09:00 — 20:00',
        friday: '09:00 — 20:00',
        saturday: '10:00 — 18:00',
        sunday: 'Sur rendez-vous'
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getSettings();
        if (data) {
            setPhoneNumber(data.phoneNumber || '');
            setPhoneNumber2(data.phoneNumber2 || '');
            setLogoPreview(data.logoUrl || null);
            setHours({
                monday: data.hoursMonday || '09:00 — 20:00',
                tuesday: data.hoursTuesday || '09:00 — 20:00',
                wednesday: data.hoursWednesday || '09:00 — 20:00',
                thursday: data.hoursThursday || '09:00 — 20:00',
                friday: data.hoursFriday || '09:00 — 20:00',
                saturday: data.hoursSaturday || '10:00 — 18:00',
                sunday: data.hoursSunday || 'Sur rendez-vous'
            });
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
        <div className="admin-form-container compact" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem', color: '#111', borderBottom: '2px solid #f1f1f1', paddingBottom: '1rem' }}>Configuration Générale</h2>
            
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0', color: '#888' }}>
                    <i className="fas fa-circle-notch fa-spin fa-2x"></i>
                </div>
            ) : (
                <form onSubmit={handleFormSubmit} className="admin-form" encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Section Contact */}
                    <div style={{ background: '#fcfcfc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i> Contact Principal
                        </h3>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Numéro WhatsApp de l'Agence</label>
                            <input 
                                type="text"
                                name="phoneNumber" 
                                value={phoneNumber} 
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Ex: +212 600 00 00 00"
                                style={{ width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ddd', marginTop: '0.5rem', transition: 'border-color 0.3s' }}
                            />
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#999' }}>Ce numéro sera utilisé pour tous les boutons WhatsApp du site.</p>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0, marginTop: '1.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deuxième Numéro de Téléphone (Optionnel)</label>
                            <input 
                                type="text"
                                name="phoneNumber2" 
                                value={phoneNumber2} 
                                onChange={(e) => setPhoneNumber2(e.target.value)}
                                placeholder="Ex: +212 600 00 00 00"
                                style={{ width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ddd', marginTop: '0.5rem', transition: 'border-color 0.3s' }}
                            />
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#999' }}>S'affichera notamment sur la page de l'agence.</p>
                        </div>
                    </div>

                    {/* Section Logo */}
                    <div style={{ background: '#fcfcfc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-image" style={{ color: '#B49339' }}></i> Identité Visuelle
                        </h3>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem', display: 'block' }}>Logo du site (optionnel)</label>
                            <ImageFileInput 
                                name="logo" 
                                accept="image/png, image/jpeg, image/webp, image/svg+xml" 
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setLogoPreview(URL.createObjectURL(file));
                                    else setLogoPreview(null);
                                }} 
                            />
                            {logoPreview && (
                                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px dashed #ccc', display: 'inline-block' }}>
                                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#666' }}>Aperçu du logo actuel :</p>
                                    <img src={logoPreview} alt="Logo preview" style={{ height: '60px', objectFit: 'contain' }} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section Heures d'Ouverture */}
                    <div style={{ background: '#fcfcfc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-clock" style={{ color: '#007bff' }}></i> Heures d'Ouverture
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {[
                                { key: 'monday', label: 'Lundi', name: 'hoursMonday' },
                                { key: 'tuesday', label: 'Mardi', name: 'hoursTuesday' },
                                { key: 'wednesday', label: 'Mercredi', name: 'hoursWednesday' },
                                { key: 'thursday', label: 'Jeudi', name: 'hoursThursday' },
                                { key: 'friday', label: 'Vendredi', name: 'hoursFriday' },
                                { key: 'saturday', label: 'Samedi', name: 'hoursSaturday' },
                                { key: 'sunday', label: 'Dimanche', name: 'hoursSunday' },
                            ].map((day) => (
                                <div key={day.key} className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>{day.label}</label>
                                    <input 
                                        type="text"
                                        name={day.name} 
                                        value={(hours as any)[day.key]} 
                                        onChange={(e) => setHours({ ...hours, [day.key]: e.target.value })}
                                        placeholder="Ex: 09:00 — 20:00"
                                        style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid #ddd', marginTop: '0.3rem' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #f1f1f1' }}>
                        <button type="submit" disabled={isSaving} style={{
                            background: isSaving ? '#666' : 'linear-gradient(135deg, #111, #000)',
                            color: 'white',
                            border: 'none',
                            padding: '1rem 2rem',
                            borderRadius: '30px',
                            fontWeight: 600,
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            cursor: isSaving ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}>
                            {isSaving ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-save"></i>}
                            {isSaving ? 'Enregistrement rapide...' : 'Sauvegarder les paramètres'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function GeneralSettings() {
    return <AdminLayout title="Paramètres"><SettingsForm /></AdminLayout>;
}