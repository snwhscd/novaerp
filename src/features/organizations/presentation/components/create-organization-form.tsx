'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { authClient } from '@/shared/infrastructure/auth/auth-client'
import {
  createOrganizationSchema,
  type CreateOrganizationInput,
} from '@/features/organizations/presentation/schemas/create-organization.schema'
import { Button } from '@/shared/presentation/components/ui/button'
import { FieldError, Label } from '@/shared/presentation/components/ui/label'
import { Input } from '@/shared/presentation/components/ui/input'

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function CreateOrganizationForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema),
  })

  const onSubmit = async (values: CreateOrganizationInput) => {
    setServerError(null)

    const { data: organization, error } = await authClient.organization.create({
      name: values.name,
      slug: slugify(values.name),
    })

    if (error) {
      setServerError(error.message ?? 'No pudimos crear la empresa.')
      return
    }

    // Crear una organización no la vuelve automáticamente la activa --
    // lo hacemos explícito, en vez de asumir que el plugin lo hizo solo.
    const { error: activateError } = await authClient.organization.setActive({
      organizationId: organization.id,
    })

    if (activateError) {
      setServerError(activateError.message ?? 'La empresa se creó, pero no pudimos activarla.')
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
        <h1 className="text-base font-semibold text-ink">Crea tu empresa</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Todo lo que registres en NovaERP vive dentro de una empresa.
        </p>
      </div>

      {serverError ? (
        <p className="rounded-default border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          {serverError}
        </p>
      ) : null}

      <div>
        <Label htmlFor="name">Nombre de la empresa</Label>
        <Input id="name" autoComplete="organization" {...register('name')} />
        <FieldError messages={errors.name ? [errors.name.message ?? ''] : undefined} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creando…' : 'Crear empresa'}
      </Button>
    </form>
  )
}
