'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { authClient } from '@/shared/infrastructure/auth/auth-client'
import { signInSchema, type SignInInput } from '@/features/auth/presentation/schemas/auth.schema'
import { ResendVerificationButton } from '@/features/auth/presentation/components/resend-verification-button'
import { Button } from '@/shared/presentation/components/ui/button'
import { FieldError, Label } from '@/shared/presentation/components/ui/label'
import { Input } from '@/shared/presentation/components/ui/input'

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [serverError, setServerError] = useState<string | null>(null)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (values: SignInInput) => {
    setServerError(null)
    setUnverifiedEmail(null)

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    })

    if (error) {
      // requireEmailVerification hace que Better Auth conteste 403
      // específicamente cuando el correo existe, la contraseña es
      // correcta, pero el correo no está verificado -- lo distinguimos
      // de un error de credenciales para ofrecer reenviar el link en
      // vez de solo decir "algo salió mal".
      if (error.status === 403) {
        setUnverifiedEmail(values.email)
      } else {
        setServerError(error.message ?? 'No pudimos iniciar tu sesión.')
      }

      return
    }

    // Si llegaste aquí desde un link de invitación (u otro flujo que
    // necesita regresarte a un lugar específico), respeta eso -- si no,
    // vas al dashboard normal.
    const redirectTo = searchParams.get('redirectTo') || '/'

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-default border border-line bg-paper-raised p-6"
    >
      <div>
        <h1 className="text-base font-semibold text-ink">Inicia sesión</h1>
        <p className="mt-1 text-sm text-ink-muted">Accede a tu cuenta de NovaERP</p>
      </div>

      {serverError ? (
        <p className="rounded-default border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          {serverError}
        </p>
      ) : null}

      {unverifiedEmail ? (
        <div className="space-y-2 rounded-default border border-warning/30 bg-warning-soft px-3 py-2">
          <p className="text-sm text-warning">Tu correo todavía no está verificado.</p>
          <ResendVerificationButton email={unverifiedEmail} />
        </div>
      ) : null}

      <div>
        <Label htmlFor="email">Correo</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        <FieldError messages={errors.email ? [errors.email.message ?? ''] : undefined} />
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register('password')}
        />
        <FieldError messages={errors.password ? [errors.password.message ?? ''] : undefined} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Entrando…' : 'Entrar'}
      </Button>

      <p className="text-center text-sm text-ink-muted">
        ¿No tienes cuenta?{' '}
        <Link href="/sign-up" className="text-accent hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  )
}
