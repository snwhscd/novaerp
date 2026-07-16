import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Mail } from 'lucide-react'

import { auth } from '@/shared/infrastructure/auth/auth'
import { LinkButton } from '@/shared/presentation/components/ui/link-button'

export default async function InvitationsPage() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session) {
    redirect('/sign-in')
  }

  // Mismo motivo que en resolveActiveOrganizationAction: sin headers a
  // propósito, para no disparar el chequeo de email verificado que no
  // tenemos construido.
  const invitations = await auth.api.listUserInvitations({
    query: { email: session.user.email },
  })

  return (
    <div className="space-y-4 rounded-default border border-line bg-paper-raised p-6">
      <div className="text-center">
        <h1 className="text-base font-semibold text-ink">Tus invitaciones</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {invitations.length === 0
            ? 'No tienes invitaciones pendientes.'
            : `Tienes ${invitations.length} invitación${invitations.length === 1 ? '' : 'es'} pendiente${invitations.length === 1 ? '' : 's'}.`}
        </p>
      </div>

      {invitations.length > 0 ? (
        <ul className="space-y-2">
          {invitations.map((invitation) => (
            <li
              key={invitation.id}
              className="flex items-center justify-between gap-3 rounded-default border border-line p-3"
            >
              <span className="flex items-center gap-2 text-sm text-ink">
                <Mail className="h-4 w-4 shrink-0 text-ink-muted" />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{invitation.organizationName}</span>
                  <span className="block text-xs text-ink-muted">como {invitation.role}</span>
                </span>
              </span>
              <LinkButton href={`/invitations/${invitation.id}`} size="sm">
                Ver
              </LinkButton>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="text-center">
        <Link href="/organizations/new" className="text-sm text-accent hover:underline">
          O crea tu propia empresa
        </Link>
      </div>
    </div>
  )
}
