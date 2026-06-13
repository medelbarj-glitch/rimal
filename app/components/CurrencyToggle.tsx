'use client';
import { useCurrency, currencies } from '@/app/context/CurrencyContext';

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();
  return (
    <div className="relative inline-flex items-center">
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as any)}
        className="appearance-none bg-transparent text-white text-sm font-medium cursor-pointer px-2 py-1 border border-white/20 rounded-md hover:border-white/50 transition-colors"
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code} className="bg-gray-900 text-white">
            {c.code} ({c.symbol})
          </option>
        ))}
      </select>
    </div>
  );
}
