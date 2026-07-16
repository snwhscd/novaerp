'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { authClient } from '@/shared/infrastructure/auth/auth-client'
import { signUpSchema, type SignUpInput } from '@/features/auth/presentation/schemas/auth.schema'
import { Button } from '@/shared/presentation/components/ui/button'
import { FieldError, Label } from '@/shared/presentation/components/ui/label'
import { Input } from '@/shared/presentation/components/ui/input'

export function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (values: SignUpInput) => {
    setServerError(null)

    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    })

    if (error) {
      setServerError(error.message ?? 'No pudimos crear tu cuenta.')
      return
    }

    // Si un día encadenamos el link de "Regístrate" desde sign-in
    // conservando ?redirectTo, esto ya lo respeta. Por ahora, si viniste
    // de una invitación sin cuenta, igual te vas a topar con ella en
    // /invitations gracias a /organizations/select -- solo que en la
    // lista completa, no directo en esta invitación específica.
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
        <h1 className="text-base font-semibold text-ink">Crea tu cuenta</h1>
        <p className="mt-1 text-sm text-ink-muted">Regístrate para usar NovaERP</p>
      </div>

      {serverError ? (
        <p className="rounded-default border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          {serverError}
        </p>
      ) : null}

      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" autoComplete="name" {...register('name')} />
        <FieldError messages={errors.name ? [errors.name.message ?? ''] : undefined} />
      </div>

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
          autoComplete="new-password"
          {...register('password')}
        />
        <FieldError messages={errors.password ? [errors.password.message ?? ''] : undefined} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>

      <p className="text-center text-sm text-ink-muted">
        ¿Ya tienes cuenta?{' '}
        <Link href="/sign-in" className="text-accent hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}
