"use client";

import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslations } from 'next-intl';

export function VehiclePrice({ prixParJour }: { prixParJour: number }) {
    const { formatPrice } = useCurrency();
    const t = useTranslations('vehicles');
    
    return (
        <span style={{ fontSize: '2rem', fontWeight: 'bold', display: 'block' }}>
            {formatPrice(prixParJour)} <small style={{ fontSize: '1rem', fontWeight: 'normal' }}>{t('per_day')}</small>
        </span>
    );
}
