import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getSessionCookie } from 'better-auth/cookies'

const PUBLIC_PATHS = ['/sign-in', '/sign-up']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path))

  // Chequeo optimista: solo verifica que la cookie exista, no la valida
  // contra la base de datos (eso sería una llamada lenta en cada request).
  // La validación real ocurre en (dashboard)/layout.tsx con
  // auth.api.getSession(). Esto es intencional -- ver la recomendación
  // oficial de Better Auth sobre no usar el proxy como única capa de auth.
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie && !isPublicPath) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  if (sessionCookie && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
