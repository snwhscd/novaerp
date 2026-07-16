import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { MailCheck } from 'lucide-react'

import { auth } from '@/shared/infrastructure/auth/auth'
import { ResendVerificationButton } from '@/features/auth/presentation/components/resend-verification-button'
import { SignOutButton } from '@/features/auth/presentation/components/sign-out-button'

export default async function VerifyEmailPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/sign-in')
  }

  if (session.user.emailVerified) {
    redirect('/')
  }

  return (
    <div className="space-y-4 rounded-default border border-line bg-paper-raised p-6 text-center">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-default bg-accent-soft text-accent">
        <MailCheck className="h-5 w-5" />
      </span>

      <div>
        <h1 className="text-base font-semibold text-ink">Verifica tu correo</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Te mandamos un link a <strong>{session.user.email}</strong>. Ábrelo para poder entrar a
          NovaERP.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <ResendVerificationButton email={session.user.email} />
        <SignOutButton />
      </div>
    </div>
  )
}
