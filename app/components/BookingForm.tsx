"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createReservation } from '../actions/createReservation';
import { Location, OptionReservation } from '@prisma/client';

interface BookingFormProps {
    modelId: number;
    modelName: string;
    modelImageUrl: string | null;
    searchParams: { [key: string]: string | string[] | undefined };
    locations: Location[];
    pricePerDay: number;
    prixSaisonniers?: any[];
    promotionActive?: boolean;
    promotionDateDebut?: Date | null;
    promotionDateFin?: Date | null;
    promotionPrixParJour?: number | null;
    reservationOptions?: OptionReservation[];
}

// ... imports
import { DateRangeSelector } from './DateRangeSelector';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { useTranslations, useLocale } from 'next-intl';
import { getTranslatedField } from '@/lib/translate';
import { useCurrency } from '../context/CurrencyContext';
// ...

const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00"
];

export function BookingForm({ 
    modelId, modelName, modelImageUrl, searchParams, locations, pricePerDay, prixSaisonniers = [],
    promotionActive, promotionDateDebut, promotionDateFin, promotionPrixParJour,
    reservationOptions = []
}: BookingFormProps) {
    const t = useTranslations('booking');
    const tRes = useTranslations('reservation');
    const locale = useLocale();
    const { formatPrice } = useCurrency();

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

    // State for selected options
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({}); // { optionId: quantity }

    const toggleOption = (optionId: number, maxQty: number) => {
        setSelectedOptions(prev => {
            if (prev[optionId]) {
                const { [optionId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [optionId]: 1 };
        });
    };

    const setOptionQuantity = (optionId: number, qty: number, maxQty: number) => {
        if (qty < 1) qty = 1;
        if (qty > maxQty) qty = maxQty;
        setSelectedOptions(prev => ({ ...prev, [optionId]: qty }));
    };

    // Calculate total price
    const calculateTotal = () => {
        if (!selectedRange?.from || !selectedRange?.to) return { total: 0, totalBase: 0, days: 0, locFees: 0, optionsFees: 0, hasPromo: false };
        const start = new Date(`${format(selectedRange.from, 'yyyy-MM-dd')}T${startTime}`);
        const end = new Date(`${format(selectedRange.to, 'yyyy-MM-dd')}T${returnTime}`);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return { total: 0, totalBase: 0, days: 0, locFees: 0, hasPromo: false };

        const diffTime = end.getTime() - start.getTime();
        if (diffTime <= 0) return { total: 0, totalBase: 0, days: 0, locFees: 0, hasPromo: false };

        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let total = 0;
        let totalBase = 0;
        let hasPromo = false;

        const promoStart = promotionDateDebut ? new Date(promotionDateDebut) : null;
        if (promoStart) promoStart.setHours(0,0,0,0);
        const promoEnd = promotionDateFin ? new Date(promotionDateFin) : null;
        if (promoEnd) promoEnd.setHours(23,59,59,999);

        for (let i = 0; i < diffDays; i++) {
            const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
            
            // Calcul base price (avec saisonniers)
            const currentSeason = prixSaisonniers.find(s => {
                const debut = new Date(s.dateDebut);
                const fin = new Date(s.dateFin);
                debut.setHours(0,0,0,0);
                fin.setHours(23,59,59,999);
                return currentDate >= debut && currentDate <= fin;
            });
            const dayBasePrice = currentSeason ? currentSeason.prixParJour : pricePerDay;
            totalBase += dayBasePrice;

            // Calcul promo price
            let dayPromoPrice = dayBasePrice;
            if (promotionActive && promoStart && promoEnd && promotionPrixParJour) {
                if (currentDate >= promoStart && currentDate <= promoEnd) {
                    dayPromoPrice = promotionPrixParJour;
                    hasPromo = true;
                }
            }
            total += dayPromoPrice;
        }

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
        totalBase += locFees;

        // Calculate options cost
        let optionsFees = 0;
        Object.entries(selectedOptions).forEach(([optionIdStr, qty]) => {
            const opt = reservationOptions.find(o => o.id === parseInt(optionIdStr));
            if (opt) {
                if (opt.perDay) {
                    optionsFees += opt.prix * qty * diffDays;
                } else {
                    optionsFees += opt.prix * qty;
                }
            }
        });

        total += optionsFees;
        totalBase += optionsFees;

        return { total, totalBase, days: diffDays, locFees, optionsFees, hasPromo };
    };

    const calculation = calculateTotal();
    const { total: totalPrice, totalBase, days, locFees, optionsFees = 0, hasPromo } = calculation;

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
                                    <strong>+ {formatPrice(locFees)}</strong>
                                </div>
                            )}
                            {optionsFees > 0 && (
                                <div className="summary-row fees">
                                    <span>{t('options_fees')}</span>
                                    <strong>+ {formatPrice(optionsFees)}</strong>
                                </div>
                            )}
                            <div className="summary-total" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{t('total_estimated')}</span>
                                    {hasPromo ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                            <span className="promo-badge-premium" style={{ marginBottom: '4px', fontSize: '0.65rem' }}>
                                                <i className="fas fa-bolt"></i> Promo
                                            </span>
                                            <div>
                                                <span className="price-crossed-out" style={{ color: '#999', fontSize: '0.85rem', marginRight: '6px' }}>{formatPrice(totalBase)}</span>
                                                <strong style={{ color: '#ff0844', fontSize: '1.2rem' }}>{formatPrice(totalPrice)}</strong>
                                            </div>
                                        </div>
                                    ) : (
                                        <strong>{formatPrice(totalPrice)}</strong>
                                    )}
                                </div>
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
                                                    {getTranslatedField(loc, 'nom', locale)} (+{formatPrice(loc.fraisSupplementaires)})
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
                                                    {getTranslatedField(loc, 'nom', locale)} (+{formatPrice(loc.fraisSupplementaires)})
                                                </option>
                                            ))}
                                            <option value="custom" style={{ fontWeight: 'bold', color: '#B49339' }}>
                                                {tRes('custom_address')}
                                            </option>
                                        </select>
                                    )}
                                </div>

                            </div>

                            {/* Options Section */}
                            {reservationOptions.length > 0 && (
                                <>
                                    <h3>{t('options_title')}</h3>
                                    <div className="booking-options-grid">
                                        {reservationOptions.map((opt) => {
                                            const isSelected = !!selectedOptions[opt.id];
                                            const qty = selectedOptions[opt.id] || 0;
                                            const optName = getTranslatedField(opt, 'nom', locale);
                                            return (
                                                <div
                                                    key={opt.id}
                                                    className={`booking-option-card ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => toggleOption(opt.id, opt.maxQuantite)}
                                                >
                                                    <div className="booking-option-icon">
                                                        <i className={`fas ${opt.icon}`}></i>
                                                    </div>
                                                    <div className="booking-option-info">
                                                        <span className="booking-option-name">{optName}</span>
                                                        <span className="booking-option-price">
                                                            {formatPrice(opt.prix)}{opt.perDay ? ` / ${t('day')}` : ''}
                                                        </span>
                                                    </div>
                                                    <div className="booking-option-check">
                                                        <i className={`fas ${isSelected ? 'fa-check-circle' : 'fa-circle'}`}></i>
                                                    </div>
                                                    {isSelected && opt.maxQuantite > 1 && (
                                                        <div className="booking-option-qty" onClick={(e) => e.stopPropagation()}>
                                                            <button
                                                                type="button"
                                                                onClick={() => setOptionQuantity(opt.id, qty - 1, opt.maxQuantite)}
                                                                className="qty-btn"
                                                            >
                                                                −
                                                            </button>
                                                            <span>{qty}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setOptionQuantity(opt.id, qty + 1, opt.maxQuantite)}
                                                                className="qty-btn"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {/* Hidden inputs for selected options */}
                                    {Object.entries(selectedOptions).map(([optId, qty]) => (
                                        <input key={optId} type="hidden" name={`option_${optId}`} value={qty} />
                                    ))}
                                </>
                            )}

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
