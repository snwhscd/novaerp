'use client'

import { useState } from 'react'

import { authClient } from '@/shared/infrastructure/auth/auth-client'
import { Button } from '@/shared/presentation/components/ui/button'

export function ResendVerificationButton({ email }: { email: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleResend = async () => {
    setStatus('sending')

    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: '/',
    })

    setStatus(error ? 'error' : 'sent')
  }

  if (status === 'sent') {
    return <p className="text-sm text-accent">Te reenviamos el correo, revisa tu bandeja.</p>
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleResend}
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Enviando…' : 'Reenviar correo de verificación'}
      </Button>
      {status === 'error' ? (
        <p className="mt-1 text-xs text-danger">No pudimos reenviarlo, intenta de nuevo.</p>
      ) : null}
    </div>
  )
}
