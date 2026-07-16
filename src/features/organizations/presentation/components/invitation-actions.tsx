'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { authClient } from '@/shared/infrastructure/auth/auth-client'
import { Button } from '@/shared/presentation/components/ui/button'

export function InvitationActions({ invitationId }: { invitationId: string }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAccept = async () => {
    setIsPending(true)
    setError(null)

    const { error: acceptError } = await authClient.organization.acceptInvitation({
      invitationId,
    })

    if (acceptError) {
      setError(acceptError.message ?? 'No pudimos aceptar la invitación.')
      setIsPending(false)
      return
    }

    // acceptInvitation ya deja la organización invitada como activa --
    // no hace falta pasar por /organizations/select.
    router.push('/')
    router.refresh()
  }

  const handleReject = async () => {
    setIsPending(true)
    setError(null)

    const { error: rejectError } = await authClient.organization.rejectInvitation({
      invitationId,
    })

    if (rejectError) {
      setError(rejectError.message ?? 'No pudimos rechazar la invitación.')
      setIsPending(false)
      return
    }

    router.push('/invitations')
    router.refresh()
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p className="rounded-default border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="button" onClick={handleAccept} disabled={isPending} className="flex-1">
          {isPending ? 'Procesando…' : 'Aceptar'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReject}
          disabled={isPending}
          className="flex-1"
        >
          Rechazar
        </Button>
      </div>
    </div>
  )
}
