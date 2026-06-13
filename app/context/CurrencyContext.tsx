"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export type CurrencyCode = 'MAD' | 'EUR' | 'USD' | 'GBP' | 'CAD' | 'AED' | 'SAR' | 'SEK' | 'NOK' | 'DKK';

export const currencies: { code: CurrencyCode; symbol: string; label: string; rate: number }[] = [
  { code: 'MAD', symbol: 'DH',  label: 'Dirham (MAD)',               rate: 1 },
  { code: 'EUR', symbol: '€',   label: 'Euro (EUR)',                  rate: 0.091 },
  { code: 'USD', symbol: '$',   label: 'Dollar US (USD)',             rate: 0.099 },
  { code: 'GBP', symbol: '£',   label: 'Livre sterling (GBP)',        rate: 0.078 },
  { code: 'CAD', symbol: 'CA$', label: 'Dollar canadien (CAD)',       rate: 0.135 },
  { code: 'AED', symbol: 'AED', label: 'Dirham EAU (AED)',            rate: 0.364 },
  { code: 'SAR', symbol: 'SAR', label: 'Riyal saoudien (SAR)',        rate: 0.372 },
  { code: 'SEK', symbol: 'kr',  label: 'Couronne suédoise (SEK)',     rate: 1.02  },
  { code: 'NOK', symbol: 'kr',  label: 'Couronne norvégienne (NOK)',  rate: 1.05  },
  { code: 'DKK', symbol: 'kr',  label: 'Couronne danoise (DKK)',      rate: 0.68  },
];

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (priceInMad: number | string | undefined | null) => string;
  currentCurrencyObj: typeof currencies[0];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('EUR');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const cookieMatch = document.cookie.match(/preferred_currency=([^;]+)/);
    if (cookieMatch && currencies.find(c => c.code === cookieMatch[1])) {
      setCurrencyState(cookieMatch[1] as CurrencyCode);
      return;
    }
    const saved = localStorage.getItem('user_currency') as CurrencyCode;
    if (saved && currencies.find(c => c.code === saved)) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('user_currency', code);
    document.cookie = `preferred_currency=${code}; max-age=86400; path=/; samesite=lax`;
  };

  const currentCurrencyObj = currencies.find(c => c.code === currency) || currencies[0];

  const formatPrice = (priceInMad: number | string | undefined | null): string => {
    if (priceInMad === undefined || priceInMad === null || priceInMad === '') return '';
    const num = typeof priceInMad === 'string' ? parseFloat(priceInMad) : priceInMad;
    if (isNaN(num)) return String(priceInMad);
    if (!isMounted) {
      const eurObj = currencies.find(c => c.code === 'EUR')!;
      return `${eurObj.symbol}${(num * eurObj.rate).toFixed(0)}`;
    }
    const converted = num * currentCurrencyObj.rate;
    return `${currentCurrencyObj.symbol}${converted.toFixed(0)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currentCurrencyObj }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
