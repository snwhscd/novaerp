import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/shared/infrastructure/auth/auth'
import { Sidebar } from '@/shared/presentation/components/layout/sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers()

  // Chequeo REAL de sesión: sí toca la base de datos (a diferencia del
  // chequeo optimista en src/proxy.ts, que solo mira si la cookie existe).
  // Este es el punto de la app donde de verdad se protege el dashboard.
  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session) {
    redirect('/sign-in')
  }

  // Sin organización activa no hay "empresa" bajo la cual trabajar --
  // todavía no existe ningún dato scoped a organización (eso viene
  // después), pero ya forzamos el flujo correcto desde ahora.
  if (!session.session.activeOrganizationId) {
    redirect('/organizations/new')
  }

  const organizations = await auth.api.listOrganizations({ headers: requestHeaders })

  return (
    <div className="flex h-screen w-full overflow-hidden bg-paper">
      <Sidebar
        user={{ name: session.user.name, email: session.user.email }}
        organizations={organizations.map((org) => ({ id: org.id, name: org.name }))}
        activeOrganizationId={session.session.activeOrganizationId}
      />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
