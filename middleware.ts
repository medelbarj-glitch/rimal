import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  MA: 'MAD',
  GB: 'GBP',
  US: 'USD',
  CA: 'CAD',
  AE: 'AED',
  SA: 'SAR', QA: 'SAR', KW: 'SAR', BH: 'SAR', OM: 'SAR',
  SE: 'SEK',
  NO: 'NOK',
  DK: 'DKK',
  FR: 'EUR', BE: 'EUR', DE: 'EUR', ES: 'EUR', IT: 'EUR',
  NL: 'EUR', PT: 'EUR', AT: 'EUR', IE: 'EUR', FI: 'EUR',
  LU: 'EUR', CH: 'EUR',
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const hasCookie = request.cookies.has('preferred_currency');
  const response = intlMiddleware(request);

  if (!hasCookie) {
    const country = request.headers.get('cf-ipcountry') || '';
    const currency = COUNTRY_TO_CURRENCY[country] || 'EUR';
    response.cookies.set('preferred_currency', currency, {
      maxAge: 86400,
      path: '/',
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
