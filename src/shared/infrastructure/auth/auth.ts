import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { organization } from 'better-auth/plugins'

import { prisma } from '@/shared/infrastructure/prisma/client'
import { sendVerificationEmail } from '@/shared/infrastructure/email/send-verification-email'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
    // Bloquea el LOGIN (no la sesión que ya tienes activa por autoSignIn
    // justo después de registrarte) si el correo no está verificado.
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true, // manda el correo automático al registrarse
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // A propósito SIN await -- evita timing attacks (que alguien
      // infiera si un correo existe midiendo cuánto tarda la respuesta).
      // Recomendación oficial de Better Auth.
      void sendVerificationEmail({
        to: user.email,
        userName: user.name,
        verificationUrl: url,
      })
    },
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
