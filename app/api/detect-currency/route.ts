import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  MA: 'MAD', GB: 'GBP', US: 'USD', CA: 'CAD', AE: 'AED',
  SA: 'SAR', QA: 'SAR', KW: 'SAR', BH: 'SAR', OM: 'SAR',
  SE: 'SEK', NO: 'NOK', DK: 'DKK',
  FR: 'EUR', BE: 'EUR', DE: 'EUR', ES: 'EUR', IT: 'EUR',
  NL: 'EUR', PT: 'EUR', AT: 'EUR', IE: 'EUR', FI: 'EUR',
  LU: 'EUR', CH: 'EUR',
};

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const existing = cookieStore.get('preferred_currency');
  if (existing) return NextResponse.json({ currency: existing.value, source: 'cookie' });

  const cfCountry = req.headers.get('cf-ipcountry');
  if (cfCountry && COUNTRY_TO_CURRENCY[cfCountry]) {
    const currency = COUNTRY_TO_CURRENCY[cfCountry];
    const res = NextResponse.json({ currency, source: 'cf-header' });
    res.cookies.set('preferred_currency', currency, { maxAge: 86400, path: '/', sameSite: 'lax' });
    return res;
  }

  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
    if (ip && ip !== '127.0.0.1' && ip !== '::1') {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
      const geo = await geoRes.json();
      if (geo.countryCode && COUNTRY_TO_CURRENCY[geo.countryCode]) {
        const currency = COUNTRY_TO_CURRENCY[geo.countryCode];
        const res = NextResponse.json({ currency, source: 'ip-api' });
        res.cookies.set('preferred_currency', currency, { maxAge: 86400, path: '/', sameSite: 'lax' });
        return res;
      }
    }
  } catch {}

  const res = NextResponse.json({ currency: 'EUR', source: 'default' });
  res.cookies.set('preferred_currency', 'EUR', { maxAge: 86400, path: '/', sameSite: 'lax' });
  return res;
}
