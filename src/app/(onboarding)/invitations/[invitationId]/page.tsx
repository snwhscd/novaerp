import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Building2 } from 'lucide-react'

import { auth } from '@/shared/infrastructure/auth/auth'
import { InvitationActions } from '@/features/organizations/presentation/components/invitation-actions'

export default async function InvitationDetailPage({
  params,
}: {
  params: Promise<{ invitationId: string }>
}) {
  const { invitationId } = await params
  const requestHeaders = await headers()

  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session) {
    redirect(`/sign-in?redirectTo=/invitations/${invitationId}`)
  }

  let invitation: Awaited<ReturnType<typeof auth.api.getInvitation>> | null = null

  try {
    invitation = await auth.api.getInvitation({
      query: { id: invitationId },
      headers: requestHeaders,
    })
  } catch {
    invitation = null
  }

  if (!invitation) {
    return (
      <div className="rounded-default border border-line bg-paper-raised p-6 text-center">
        <p className="text-sm font-medium text-ink">Esta invitación no está disponible</p>
        <p className="mt-1 text-sm text-ink-muted">
          Puede que ya haya expirado, ya fue usada, o no es para tu cuenta ({session.user.email}).
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-default border border-line bg-paper-raised p-6 text-center">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-default bg-accent-soft text-accent">
        <Building2 className="h-5 w-5" />
      </span>

      <div>
        <h1 className="text-base font-semibold text-ink">{invitation.organizationName}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {invitation.inviterEmail} te invitó a unirte como <strong>{invitation.role}</strong>
        </p>
      </div>

      <InvitationActions invitationId={invitation.id} />
    </div>
  )
}
