'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { authClient } from '@/shared/infrastructure/auth/auth-client'
import { signInSchema, type SignInInput } from '@/features/auth/presentation/schemas/auth.schema'
import { Button } from '@/shared/presentation/components/ui/button'
import { FieldError, Label } from '@/shared/presentation/components/ui/label'
import { Input } from '@/shared/presentation/components/ui/input'

export function SignInForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (values: SignInInput) => {
    setServerError(null)

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    })

    if (error) {
      setServerError(error.message ?? 'No pudimos iniciar tu sesión.')
      return
    }

    router.push('/')
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
