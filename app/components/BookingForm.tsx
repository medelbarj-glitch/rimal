"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createReservation } from '../actions/createReservation';
import { Location } from '@prisma/client';

interface BookingFormProps {
    modelId: number;
    modelName: string;
    modelImageUrl: string | null;
    searchParams: { [key: string]: string | string[] | undefined };
    locations: Location[];
    pricePerDay: number;
}

// ... imports
import { DateRangeSelector } from './DateRangeSelector';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { useTranslations, useLocale } from 'next-intl';
import { getTranslatedField } from '@/lib/translate';
// ...

const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00"
];

export function BookingForm({ modelId, modelName, modelImageUrl, searchParams, locations, pricePerDay }: BookingFormProps) {
    const t = useTranslations('booking');
    const tRes = useTranslations('reservation');
    const locale = useLocale();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for dates
    const initialStartDate = searchParams.startDate ? new Date(searchParams.startDate as string) : undefined;
    const initialEndDate = searchParams.endDate ? new Date(searchParams.endDate as string) : undefined;

    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
        from: initialStartDate,
        to: initialEndDate,
    });

    const [startTime, setStartTime] = useState(searchParams.startTime as string || '10:00');
    const [returnTime, setReturnTime] = useState(searchParams.returnTime as string || '10:00');

    // State for locations to calculate fees
    const [locationId, setLocationId] = useState<string>(searchParams.location as string || '');
    const [returnLocationId, setReturnLocationId] = useState<string>(searchParams.returnLocation as string || '');

    // State for custom (free-text) location mode — mirrors /reservation sidebar
    const [isCustomPickup, setIsCustomPickup] = useState(!!searchParams.customLocation);
    const [isCustomReturn, setIsCustomReturn] = useState(!!searchParams.customReturnLocation);
    const [customPickupText, setCustomPickupText] = useState(searchParams.customLocation as string || '');
    const [customReturnText, setCustomReturnText] = useState(searchParams.customReturnLocation as string || '');

    // Calculate total price
    const calculateTotal = () => {
        if (!selectedRange?.from || !selectedRange?.to) return { total: 0, days: 0, locFees: 0 };
        const start = new Date(`${format(selectedRange.from, 'yyyy-MM-dd')}T${startTime}`);
        const end = new Date(`${format(selectedRange.to, 'yyyy-MM-dd')}T${returnTime}`);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return { total: 0, days: 0, locFees: 0 };

        const diffTime = end.getTime() - start.getTime();
        if (diffTime <= 0) return { total: 0, days: 0, locFees: 0 };

        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let total = diffDays * pricePerDay;
        // Calculation logic strictly mirroring server action
        let locFees = 0;

        if (locationId) {
            const loc = locations.find(l => l.id.toString() === locationId);
            if (loc) locFees += loc.fraisSupplementaires;
        }

        // Determine effective return ID logic
        const effectiveReturnId = returnLocationId
            ? returnLocationId
            : (!searchParams.customReturnLocation && !searchParams.customLocation && locationId)
                ? locationId
                : null;

        if (effectiveReturnId) {
            const loc = locations.find(l => l.id.toString() === effectiveReturnId);
            if (loc) locFees += loc.fraisSupplementaires;
        }

        total += locFees;

        return { total, days: diffDays, locFees };
    };

    const calculation = calculateTotal();
    const { total: totalPrice, days, locFees } = calculation;

    async function handleSubmit(formData: FormData) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsSubmitting(true);
        setError(null);

        const result = await createReservation(formData);

        if (result?.error) {
            setError(result.error);
            setIsSubmitting(false);
        }
    }

    return (
        <>
            {/* Header row — title + back button, mirrors .reservation-header */}
            <div className="booking-header">
                <h1 className="booking-title">{t('title')}</h1>
                <a href="/reservation" className="back-button">
                    <i className="fas fa-arrow-left"></i> {tRes('back')}
                </a>
            </div>

            <div className="booking-layout">
                {/* LEFT — Summary card (like reservation sidebar) */}
                <div className="summary-column">
                    <div className="booking-summary-card">
                        <h3>{t('summary')}</h3>
                        {modelImageUrl && (
                            <img src={modelImageUrl} alt={modelName} />
                        )}
                        <div className="summary-details">
                            <h4>{modelName}</h4>
                            <div className="summary-row">
                                <span>{t('from')}</span>
                                <strong>{selectedRange?.from ? format(selectedRange.from, 'dd/MM/yyyy') : '-'}</strong>
                            </div>
                            <div className="summary-row">
                                <span>{t('to')}</span>
                                <strong>{selectedRange?.to ? format(selectedRange.to, 'dd/MM/yyyy') : '-'}</strong>
                            </div>
                            <div className="summary-row">
                                <span>{t('duration')}</span>
                                <strong>{days} {t('days')}</strong>
                            </div>
                            {locFees > 0 && (
                                <div className="summary-row fees">
                                    <span>{t('location_fees')}</span>
                                    <strong>+ {locFees} DH</strong>
                                </div>
                            )}
                            <div className="summary-total">
                                <span>{t('total_estimated')}</span>
                                <strong>{totalPrice} DH</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Form (like reservation-content) */}
                <div className="form-column">
                    <form action={handleSubmit} className="booking-form">
                        <input type="hidden" name="modelId" value={modelId} />
                        <input type="hidden" name="startDate" value={selectedRange?.from ? format(selectedRange.from, 'yyyy-MM-dd') : ''} />
                        <input type="hidden" name="endDate" value={selectedRange?.to ? format(selectedRange.to, 'yyyy-MM-dd') : ''} />
                        <input type="hidden" name="startTime" value={startTime} />
                        <input type="hidden" name="returnTime" value={returnTime} />

                        <div className="booking-form-section">
                            <h3>{t('dates')}</h3>
                            <div className="form-group full-width">
                                <DateRangeSelector
                                    startDate={selectedRange?.from}
                                    endDate={selectedRange?.to}
                                    onDateChange={setSelectedRange}
                                    startTime={startTime}
                                    returnTime={returnTime}
                                    onStartTimeChange={setStartTime}
                                    onReturnTimeChange={setReturnTime}
                                    hours={timeSlots}
                                    numberOfMonths={2}
                                    className="booking-style"
                                />
                            </div>

                            <h3>{t('locations')}</h3>
                            <div className="form-grid">

                                {/* --- Lieu de départ --- */}
                                <div className="form-group">
                                    <label htmlFor="locationId">
                                        <i className="fas fa-map-marker-alt" style={{ color: 'var(--book-gold)' }}></i>
                                        {t('pickup_location')}
                                    </label>

                                    {isCustomPickup ? (
                                        /* Free-text input mode */
                                        <div className="custom-location-wrapper">
                                            <input
                                                type="text"
                                                name="customLocation"
                                                value={customPickupText}
                                                onChange={(e) => setCustomPickupText(e.target.value)}
                                                placeholder={t('address_placeholder')}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="custom-location-cancel"
                                                onClick={() => { setIsCustomPickup(false); setCustomPickupText(''); }}
                                                title={tRes('sidebar_cancel')}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ) : (
                                        /* Standard select mode */
                                        <select
                                            id="locationId"
                                            name="locationId"
                                            value={locationId}
                                            onChange={(e) => {
                                                if (e.target.value === 'custom') {
                                                    setIsCustomPickup(true);
                                                    setLocationId('');
                                                } else {
                                                    setLocationId(e.target.value);
                                                }
                                            }}
                                            required
                                        >
                                            <option value="">{t('select_location')}</option>
                                            {locations.map((loc) => (
                                                <option key={loc.id} value={loc.id}>
                                                    {getTranslatedField(loc, 'nom', locale)} (+{loc.fraisSupplementaires} DH)
                                                </option>
                                            ))}
                                            <option value="custom" style={{ fontWeight: 'bold', color: '#B49339' }}>
                                                {tRes('custom_address')}
                                            </option>
                                        </select>
                                    )}
                                </div>

                                {/* --- Lieu de retour --- */}
                                <div className="form-group">
                                    <label htmlFor="returnLocationId">
                                        <i className="fas fa-map-marker-alt" style={{ color: 'var(--book-gold)' }}></i>
                                        {t('return_location')}
                                    </label>

                                    {isCustomReturn ? (
                                        /* Free-text input mode */
                                        <div className="custom-location-wrapper">
                                            <input
                                                type="text"
                                                name="customReturnLocation"
                                                value={customReturnText}
                                                onChange={(e) => setCustomReturnText(e.target.value)}
                                                placeholder={t('address_placeholder')}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="custom-location-cancel"
                                                onClick={() => { setIsCustomReturn(false); setCustomReturnText(''); }}
                                                title={tRes('sidebar_cancel')}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ) : (
                                        /* Standard select mode */
                                        <select
                                            id="returnLocationId"
                                            name="returnLocationId"
                                            value={returnLocationId}
                                            onChange={(e) => {
                                                if (e.target.value === 'custom') {
                                                    setIsCustomReturn(true);
                                                    setReturnLocationId('');
                                                } else {
                                                    setReturnLocationId(e.target.value);
                                                }
                                            }}
                                            required={!isCustomPickup}
                                        >
                                            <option value="">{isCustomPickup ? t('same_as_pickup') : t('select_location')}</option>
                                            {locations.map((loc) => (
                                                <option key={loc.id} value={loc.id}>
                                                    {getTranslatedField(loc, 'nom', locale)} (+{loc.fraisSupplementaires} DH)
                                                </option>
                                            ))}
                                            <option value="custom" style={{ fontWeight: 'bold', color: '#B49339' }}>
                                                {tRes('custom_address')}
                                            </option>
                                        </select>
                                    )}
                                </div>

                            </div>
                            <h3>{t('details')}</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="lastName">{t('last_name')}</label>
                                    <input type="text" id="lastName" name="lastName" placeholder={t('last_name_placeholder')} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="firstName">{t('first_name')}</label>
                                    <input type="text" id="firstName" name="firstName" placeholder={t('first_name_placeholder')} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">{t('email')}</label>
                                    <input type="email" id="email" name="email" placeholder={t('email_placeholder')} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">{t('phone')}</label>
                                    <input type="tel" id="phone" name="phone" placeholder={t('phone_placeholder')} required />
                                </div>
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="submit-button" disabled={isSubmitting}>
                            {isSubmitting ? t('processing') : t('confirm')}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
