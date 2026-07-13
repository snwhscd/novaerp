import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/shared/infrastructure/auth/auth'
import { Sidebar } from '@/shared/presentation/components/layout/sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Chequeo REAL de sesión: sí toca la base de datos (a diferencia del
  // chequeo optimista en src/proxy.ts, que solo mira si la cookie existe).
  // Este es el punto de la app donde de verdad se protege el dashboard.
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/sign-in')
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-paper">
      <Sidebar user={{ name: session.user.name, email: session.user.email }} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
