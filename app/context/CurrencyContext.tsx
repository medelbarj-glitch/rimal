"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export type CurrencyCode = 'MAD' | 'EUR' | 'USD';

export const currencies: { code: CurrencyCode; symbol: string; label: string; rate: number }[] = [
  { code: 'MAD', symbol: 'DH', label: 'Dirham (MAD)', rate: 1 },
  { code: 'EUR', symbol: '€', label: 'Euro (EUR)', rate: 0.093 }, // 1 MAD = 0.093 EUR (~10.75 MAD = 1 EUR)
  { code: 'USD', symbol: '$', label: 'Dollar (USD)', rate: 0.100 }, // 1 MAD = 0.10 USD (~10 MAD = 1 USD)
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
    // Load from local storage on mount
    const saved = localStorage.getItem('user_currency') as CurrencyCode;
    if (saved && currencies.find(c => c.code === saved)) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('user_currency', code);
  };

  const currentCurrencyObj = currencies.find(c => c.code === currency) || currencies[0];

  const formatPrice = (priceInMad: number | string | undefined | null): string => {
    if (priceInMad === undefined || priceInMad === null || priceInMad === '') {
      return '';
    }
    
    // We only format the number visually to avoid hydration mismatches
    // and layout shifts.
    const num = typeof priceInMad === 'string' ? parseFloat(priceInMad) : priceInMad;
    
    if (isNaN(num)) return String(priceInMad);

    if (!isMounted) {
      // Prevents hydration error by returning EUR price on first render server-side
      const eurObj = currencies.find(c => c.code === 'EUR')!;
      const converted = num * eurObj.rate;
      return `${eurObj.symbol}${converted.toFixed(2)}`;
    }

    const converted = num * currentCurrencyObj.rate;
    
    // Format depending on currency
    if (currency === 'MAD') {
      return `${Math.round(converted)} ${currentCurrencyObj.symbol}`;
    }
    
    // For EUR and USD, we can show 2 decimals if we want, or round to int
    return `${currentCurrencyObj.symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currentCurrencyObj }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
