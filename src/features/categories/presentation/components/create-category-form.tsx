'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import {
  createCategoryAction,
  type CreateCategoryActionState,
} from '@/features/categories/presentation/actions/create-category.action'
import { Button } from '@/shared/presentation/components/ui/button'
import { FieldError, Label } from '@/shared/presentation/components/ui/label'
import { Input } from '@/shared/presentation/components/ui/input'

const initialState: CreateCategoryActionState = { success: false }

export function CreateCategoryForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createCategoryAction, initialState)

  useEffect(() => {
    if (state.success) {
      router.push('/categories')
    }
  }, [state.success, router])

  return (
    <form action={formAction} className="max-w-md space-y-4">
      {state.message && !state.success ? (
        <p className="rounded-default border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" placeholder="Muebles de oficina" required />
        <FieldError messages={state.fieldErrors?.name} />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Input id="description" name="description" placeholder="Opcional" />
        <FieldError messages={state.fieldErrors?.description} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Guardando…' : 'Crear categoría'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
