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

  // Correo sin verificar: ni siquiera llegamos a preguntar por
  // organización -- primero confirmamos que el correo es de verdad
  // suyo. autoSignIn te deja con sesión activa justo después de
  // registrarte aunque no hayas verificado todavía, así que este
  // chequeo es necesario incluso con requireEmailVerification activo en
  // el login.
  if (!session.user.emailVerified) {
    redirect('/verify-email')
  }

  // Sin organización activa no hay "empresa" bajo la cual trabajar.
  // OJO: esto NO significa que el usuario no tenga ninguna empresa --
  // Better Auth deja activeOrganizationId en null en cada sesión nueva,
  // incluso si ya pertenece a una. /organizations/select distingue esos
  // dos casos (tiene empresas pero ninguna activa vs. de verdad cero).
  if (!session.session.activeOrganizationId) {
    redirect('/organizations/select')
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
