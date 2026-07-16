import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Mail } from 'lucide-react'

import { auth } from '@/shared/infrastructure/auth/auth'
import { InviteMemberForm } from '@/features/organizations/presentation/components/invite-member-form'
import { Badge } from '@/shared/presentation/components/ui/badge'
import { Topbar } from '@/shared/presentation/components/layout/topbar'

export default async function TeamPage() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session || !session.session.activeOrganizationId) {
    redirect('/organizations/select')
  }

  const [{ members }, invitations] = await Promise.all([
    auth.api.listMembers({ headers: requestHeaders }),
    auth.api.listInvitations({
      query: { organizationId: session.session.activeOrganizationId },
      headers: requestHeaders,
    }),
  ])

  const pendingInvitations = invitations.filter((invitation) => invitation.status === 'pending')

  return (
    <>
      <Topbar title="Equipo" />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-xl space-y-6">
          <InviteMemberForm />

          <div>
            <h2 className="mb-2 text-sm font-semibold text-ink">Miembros ({members.length})</h2>
            <div className="overflow-hidden rounded-default border border-line bg-paper-raised">
              <table className="w-full text-sm">
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{member.user.name}</p>
                        <p className="text-xs text-ink-muted">{member.user.email}</p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant="neutral">{member.role}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pendingInvitations.length > 0 ? (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-ink">
                Invitaciones pendientes ({pendingInvitations.length})
              </h2>
              <div className="overflow-hidden rounded-default border border-line bg-paper-raised">
                <table className="w-full text-sm">
                  <tbody>
                    {pendingInvitations.map((invitation) => (
                      <tr key={invitation.id} className="border-b border-line last:border-0">
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-2 text-ink">
                            <Mail className="h-4 w-4 text-ink-muted" />
                            {invitation.email}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Badge variant="warning">{invitation.role}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  )
}
