import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'

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

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'STAFF',
        input: false, // el usuario no puede autoasignarse el rol al registrarse
      },
    },
  },

  // Debe ir al final del arreglo: sin este plugin, las Server Actions no
  // pueden setear cookies (Next.js las descarta si no pasan por su propia
  // API de cookies()).
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
