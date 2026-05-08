import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// Clé secrète pour signer le JWT. En production, elle doit être définie dans .env (ex: JWT_SECRET=votre_clef_secrete)
const secretKey = process.env.JWT_SECRET || 'clef-secrete-par-defaut-très-longue-et-complexe-12345!'
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    // Session valide pour 30 jours (se souvenir de moi)
    .setExpirationTime('30d') 
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        return null
    }
}

export async function createSession(adminId: number, email: string) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ adminId, email })

  const cookieStore = await cookies();
  cookieStore.set('admin_session', session, {
    expires,
    httpOnly: true, // Empêche l'accès via JS (XSS)
    secure: process.env.NODE_ENV === 'production', // Uniquement HTTPS en prod
    sameSite: 'lax', // Protection CSRF (lax recommandé pour éviter les soucis Chrome)
    path: '/',
  })
}

export async function verifySession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('admin_session')?.value
  const session = await decrypt(cookie || '')
  
  if (!session?.adminId) {
    return null
  }
  return session
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.set('admin_session', '', {
    expires: new Date(0),
    httpOnly: true,
    path: '/'
  })
}

/**
 * GARDE DE SÉCURITÉ — à appeler en tête de TOUTE Server Action admin.
 * Si le cookie est absent, expiré ou falsifié, coupe l'exécution immédiatement.
 */
export async function requireAuth() {
  const session = await verifySession()
  if (!session) {
    throw new Error('Non autorisé. Veuillez vous connecter.')
  }
  return session
}
