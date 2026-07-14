import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { organization } from 'better-auth/plugins'

import { prisma } from '@/shared/infrastructure/prisma/client'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },

  // Nota: el rol de un usuario NO se configura aquí. Vive en el modelo
  // Member (rol por organización) y lo administra el plugin organization
  // directamente -- por defecto usa "owner" / "admin" / "member".

  // Sin `teams` -- multi-empresa básico por ahora: crear, listar, cambiar
  // de empresa activa. Nada de sub-equipos dentro de una empresa todavía.
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
    }),
    // Debe ir al final del arreglo: sin este plugin, las Server Actions no
    // pueden setear cookies (Next.js las descarta si no pasan por su propia
    // API de cookies()).
    nextCookies(),
  ],
})

export type Session = typeof auth.$Infer.Session
