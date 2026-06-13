import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET || 'clef-secrete-par-defaut-très-longue-et-complexe-12345!'
const key = new TextEncoder().encode(secretKey)

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch {
    return null
  }
}

const intlMiddleware = createMiddleware(routing);

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  MA: 'MAD', GB: 'GBP', US: 'USD', CA: 'CAD', AE: 'AED',
  SA: 'SAR', QA: 'SAR', KW: 'SAR', BH: 'SAR', OM: 'SAR',
  SE: 'SEK', NO: 'NOK', DK: 'DKK',
  FR: 'EUR', BE: 'EUR', DE: 'EUR', ES: 'EUR', IT: 'EUR',
  NL: 'EUR', PT: 'EUR', AT: 'EUR', IE: 'EUR', FI: 'EUR',
  LU: 'EUR', CH: 'EUR',
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path === '/admin/login') {
    const cookie = request.cookies.get('admin_session')?.value
    if (cookie) {
      const session = await verifyToken(cookie)
      if (session?.adminId) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
    return NextResponse.next()
  }

  if (path.startsWith('/admin')) {
    const cookie = request.cookies.get('admin_session')?.value
    if (!cookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    const session = await verifyToken(cookie)
    if (!session || !session.adminId) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.set('admin_session', '', { expires: new Date(0), path: '/' })
      return response
    }
    return NextResponse.next()
  }

  const intlResponse = intlMiddleware(request);

  const host = request.headers.get('host');
  if (host === 'bouderba-rental.com') {
    if (intlResponse.headers.has('location')) {
      const location = intlResponse.headers.get('location')!;
      const redirectUrl = new URL(location, request.url);
      redirectUrl.hostname = 'www.bouderba-rental.com';
      redirectUrl.port = '';
      redirectUrl.protocol = 'https:';
      return NextResponse.redirect(redirectUrl, intlResponse.status);
    } else {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.hostname = 'www.bouderba-rental.com';
      redirectUrl.port = '';
      redirectUrl.protocol = 'https:';
      return NextResponse.redirect(redirectUrl, 308);
    }
  }

  // Currency detection from IP country header
  if (!request.cookies.has('preferred_currency')) {
    const country = request.headers.get('cf-ipcountry') || '';
    const currency = COUNTRY_TO_CURRENCY[country] || 'EUR';
    intlResponse.cookies.set('preferred_currency', currency, { maxAge: 86400, path: '/', sameSite: 'lax' });
  }

  return intlResponse;
}

export default middleware;

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
