'use server'

import { headers } from 'next/headers'

import { auth } from '@/shared/infrastructure/auth/auth'

export type ResolveActiveOrganizationResult =
  | { outcome: 'activated' }
  | { outcome: 'has-pending-invitations' }
  | { outcome: 'no-organizations' }
  | { outcome: 'no-session' }

export async function resolveActiveOrganizationAction(): Promise<ResolveActiveOrganizationResult> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session) {
    return { outcome: 'no-session' }
  }

  const organizations = await auth.api.listOrganizations({ headers: requestHeaders })

  if (organizations.length > 0) {
    // Activar una organización setea una cookie -- por eso este código
    // TIENE que vivir en un Server Action, nunca en el render de un
    // Server Component (Next.js no lo permite).
    //
    // Sin selector todavía si hay varias -- se activa la primera. Cuando
    // eso importe de verdad (usuario en 2+ empresas), aquí es donde se
    // agrega el picker.
    await auth.api.setActiveOrganization({
      headers: requestHeaders,
      body: { organizationId: organizations[0].id },
    })

    return { outcome: 'activated' }
  }

  // Sin organizaciones -- pero ojo, puede que tenga invitaciones
  // pendientes de otra empresa. OJO: llamamos SIN headers a propósito.
  // listUserInvitations exige email verificado cuando detecta una
  // sesión, y no tenemos verificación de correo construida todavía --
  // pasando el email directo por query en vez de por sesión, el
  // endpoint evita ese chequeo (así está diseñado para uso
  // server-to-server).
  const pendingInvitations = await auth.api.listUserInvitations({
    query: { email: session.user.email },
  })

  if (pendingInvitations.length > 0) {
    return { outcome: 'has-pending-invitations' }
  }

  return { outcome: 'no-organizations' }
}
