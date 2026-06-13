import { NextResponse } from 'next/server';

export const revalidate = 3600;

const FALLBACK_RATES: Record<string, number> = {
  EUR: 0.091,
  USD: 0.099,
  GBP: 0.078,
  CAD: 0.135,
  AED: 0.364,
  SAR: 0.372,
  SEK: 1.02,
  NOK: 1.05,
  DKK: 0.68,
};

export async function GET() {
  try {
    const res = await fetch(
      'https://api.frankfurter.app/latest?base=MAD&symbols=EUR,USD,GBP,CAD,AED,SAR,SEK,NOK,DKK',
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    if (data.rates) {
      return NextResponse.json({ rates: data.rates, source: 'live', base: 'MAD' });
    }
  } catch {}
  return NextResponse.json({ rates: FALLBACK_RATES, source: 'fallback', base: 'MAD' });
}
