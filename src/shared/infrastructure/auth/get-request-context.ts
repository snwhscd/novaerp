import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/shared/infrastructure/auth/auth'
import { RequestContext } from '@/shared/application/context/request-context'

export async function getRequestContext(): Promise<RequestContext> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/sign-in')
  }

  if (!session.session.activeOrganizationId) {
    redirect('/organizations/new')
  }

  return {
    userId: session.user.id,
    organizationId: session.session.activeOrganizationId,
  }
}
