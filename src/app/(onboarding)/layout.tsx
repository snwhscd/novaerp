import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/shared/infrastructure/auth/auth'
import { CenteredShell } from '@/shared/presentation/components/layout/centered-shell'

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  // Requiere sesión, pero a propósito NO requiere organización activa --
  // esta es justo la ruta de escape para el usuario que todavía no
  // tiene ninguna. Por eso vive fuera de (dashboard), que sí la exige.
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/sign-in')
  }

  return <CenteredShell>{children}</CenteredShell>
}
