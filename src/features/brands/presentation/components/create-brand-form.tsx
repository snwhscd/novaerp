'use client'

import {
  createBrandAction,
  type CreateBrandActionState,
} from '@/features/brands/presentation/actions/create-brand-action'
import { Button } from '@/shared/presentation/components/ui/button'
import { Input } from '@/shared/presentation/components/ui/input'
import { FieldError, Label } from '@/shared/presentation/components/ui/label'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'

const inititalState: CreateBrandActionState = { success: false }

export function CreateBrandForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createBrandAction, inititalState)

  useEffect(() => {
    if (state.success) {
      router.push('/brands')
    }
  }, [state.success, router])

  return (
    <form action={formAction} className="max-w-md space-y-4">
      {state.message && !state.success ? (
        <p className="rounded-default border border-danger/30 bg-danger-softw px-3 py-2 text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" placeholder="Samsung" required />
        <FieldError messages={state.fieldErrors?.name} />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Input id="description" name="description" placeholder="Opcional" />
        <FieldError messages={state.fieldErrors?.description} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Crear marca'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
