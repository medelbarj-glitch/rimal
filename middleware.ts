import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Reproduit la logique de decrypt de lib/auth.ts mais sans dépendance incompatible Edge
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

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Ne pas protéger la page de login elle-même
  if (path === '/admin/login') {
    // Si déjà connecté, rediriger vers /admin directement
    const cookie = request.cookies.get('admin_session')?.value
    if (cookie) {
      const session = await verifyToken(cookie)
      if (session?.adminId) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
    return NextResponse.next()
  }

  // Protéger toutes les autres routes /admin/*
  if (path.startsWith('/admin')) {
    const cookie = request.cookies.get('admin_session')?.value

    if (!cookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const session = await verifyToken(cookie)
    if (!session || !session.adminId) {
      // Cookie falsifié ou expiré → dégager
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.set('admin_session', '', { expires: new Date(0), path: '/' })
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
