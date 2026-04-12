"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Location } from '@prisma/client';
import { format } from 'date-fns';
import { DateRangeSelector } from './DateRangeSelector';
import '../../styles/reservation.css'; // Ensure we have access to styles, though ideally they are global or module
import { useTranslations, useLocale } from 'next-intl';
import { getTranslatedField } from '@/lib/translate';

interface ReservationSidebarProps {
    locations: Location[];
    className?: string;
}

const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00"
];

export function ReservationSidebar({ locations, className }: ReservationSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('reservation');
    const locale = useLocale();

    // --- State for Search Params ---
    const [pickupLocationId, setPickupLocationId] = useState(searchParams.get('customLocation') || searchParams.get('location') || '');
    const [returnLocationId, setReturnLocationId] = useState(searchParams.get('customReturnLocation') || searchParams.get('returnLocation') || '');

    // Date/Time State
    const [startDate, setStartDate] = useState<Date | undefined>(
        searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
    );

    const [startTime, setStartTime] = useState(searchParams.get('startTime') || '10:00');
    const [returnTime, setReturnTime] = useState(searchParams.get('returnTime') || '10:00');

    // --- State for Filters ---
    const [transmission, setTransmission] = useState<string[]>([]);

    useEffect(() => {
        const t = searchParams.get('transmission');
        if (t) {
            setTransmission(t.split(','));
        } else {
            setTransmission([]);
        }
    }, [searchParams]);

    // --- Handlers ---

    const handleSearchUpdate = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (searchParams.get('customLocation') !== null) {
            if (pickupLocationId) params.set('customLocation', pickupLocationId); // pickupLocationId holds the text in this mode
            // Clear standard location if custom is set
            params.delete('location');
        } else {
            if (pickupLocationId) params.set('location', pickupLocationId);
            else params.delete('location');
            params.delete('customLocation');
        }

        if (searchParams.get('customReturnLocation') !== null) {
            if (returnLocationId) params.set('customReturnLocation', returnLocationId);
            params.delete('returnLocation');
        } else {
            if (returnLocationId) params.set('returnLocation', returnLocationId);
            else params.delete('returnLocation');
            params.delete('customReturnLocation');
        }

        if (startDate) params.set('startDate', format(startDate, 'yyyy-MM-dd'));
        else params.delete('startDate');

        if (endDate) params.set('endDate', format(endDate, 'yyyy-MM-dd'));
        else params.delete('endDate');

        if (startTime) params.set('startTime', startTime);
        if (returnTime) params.set('returnTime', returnTime);

        router.push(`/reservation?${params.toString()}`);
    };

    const handleFilterChange = (type: 'transmission', value: string) => {
        let newValues = [...transmission];
        if (newValues.includes(value)) {
            newValues = newValues.filter(v => v !== value);
        } else {
            newValues.push(value);
        }
        setTransmission(newValues);

        const params = new URLSearchParams(searchParams.toString());
        if (newValues.length > 0) {
            params.set(type, newValues.join(','));
        } else {
            params.delete(type);
        }
        router.push(`/reservation?${params.toString()}`);
    };

    return (
        <aside className={`reservation-sidebar ${className || ''}`}>

            {/* --- Block 1: Modifier la recherche --- */}
            <div className="sidebar-block search-modifier">
                <h3 className="sidebar-title">{t('sidebar_modify_search')}</h3>

                <div className="form-group">
                    <label>{t('pickup')}</label>
                    {/* Check if custom location is active or standard select */}
                    {searchParams.get('customLocation') !== null ? (
                        <div className="sidebar-custom-input-wrapper">
                            <input
                                type="text"
                                value={pickupLocationId || ''}
                                onChange={(e) => setPickupLocationId(e.target.value)}
                                placeholder={t('sidebar_pickup_placeholder')}
                            />
                            <i
                                className="fas fa-times"
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.delete('customLocation');
                                    setPickupLocationId('');
                                    router.push(`/reservation?${params.toString()}`);
                                }}
                                title={t('sidebar_cancel')}
                            ></i>
                        </div>
                    ) : (
                        <select
                            value={pickupLocationId || ''}
                            onChange={(e) => {
                                if (e.target.value === 'custom') {
                                    // Switch to custom mode via router push or state handling?
                                    // Better to just set a flag locally or push a param?
                                    // Let's simple prompt or changing UI state.
                                    // For sidebar simplicity, we might need a button to toggle "Autre"
                                    // But to keep it consistent, let's just use the select with an 'Autre' option that changes the UI.
                                    // Simplified: Just add "Autre" to options. If selected, changing UI to input.
                                    setPickupLocationId(''); // Clear previous selection
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('customLocation', ''); // set empty to trigger input mode
                                    router.push(`/reservation?${params.toString()}`);
                                } else {
                                    setPickupLocationId(e.target.value);
                                }
                            }}
                        >
                            <option value="">{t('choose_location')}</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{getTranslatedField(loc, 'nom', locale)}</option>
                            ))}
                            <option value="custom" style={{ fontWeight: 'bold', color: '#B49339' }}>{t('custom_address')}</option>
                        </select>
                    )}
                </div>

                <div className="form-group">
                    <label>{t('return')}</label>
                    {searchParams.get('customReturnLocation') !== null ? (
                        <div className="sidebar-custom-input-wrapper">
                            <input
                                type="text"
                                value={returnLocationId}
                                onChange={(e) => setReturnLocationId(e.target.value)}
                                placeholder={t('return_address_placeholder')}
                            />
                            <i
                                className="fas fa-times"
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.delete('customReturnLocation');
                                    setReturnLocationId('');
                                    router.push(`/reservation?${params.toString()}`);
                                }}
                                title={t('sidebar_cancel')}
                            ></i>
                        </div>
                    ) : (
                        <select
                            value={returnLocationId || ''}
                            onChange={(e) => {
                                if (e.target.value === 'custom') {
                                    setReturnLocationId(''); // Clear previous selection
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('customReturnLocation', '');
                                    router.push(`/reservation?${params.toString()}`);
                                } else {
                                    setReturnLocationId(e.target.value);
                                }
                            }}
                        >
                            <option value="">{t('sidebar_same_as_pickup')}</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{getTranslatedField(loc, 'nom', locale)}</option>
                            ))}
                            <option value="custom" style={{ fontWeight: 'bold', color: '#B49339' }}>{t('custom_address')}</option>
                        </select>
                    )}
                </div>

                {/* New Date Selector in Sidebar */}
                <div className="form-group sidebar-date-selector">
                    <DateRangeSelector
                        startDate={startDate}
                        endDate={endDate}
                        onDateChange={(range) => {
                            setStartDate(range.from);
                            setEndDate(range.to);
                        }}
                        startTime={startTime}
                        returnTime={returnTime}
                        onStartTimeChange={setStartTime}
                        onReturnTimeChange={setReturnTime}
                        hours={timeSlots}
                        className="sidebar-style" // Optional: for specific overrides
                        numberOfMonths={1}
                    />
                </div>

                <button className="update-search-btn" onClick={handleSearchUpdate}>
                    {t('search')}
                </button>
            </div>

            {/* --- Block 2: Filtres --- */}
            <div className="sidebar-block filters-block">
                <h3 className="sidebar-title">{t('sidebar_filters')}</h3>

                <div className="filter-group">
                    <h4>{t('sidebar_transmission')}</h4>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={transmission.includes('MANUELLE')}
                            onChange={() => handleFilterChange('transmission', 'MANUELLE')}
                        />
                        <span>{t('sidebar_manual')}</span>
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={transmission.includes('AUTOMATIQUE')}
                            onChange={() => handleFilterChange('transmission', 'AUTOMATIQUE')}
                        />
                        <span>{t('sidebar_automatic')}</span>
                    </label>
                </div>
            </div>

        </aside>
    );
}
