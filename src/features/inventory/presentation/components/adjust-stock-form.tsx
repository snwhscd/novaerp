'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import {
  adjustStockAction,
  type AdjustStockActionState,
} from '@/features/inventory/presentation/actions/adjust-stock.action'
import { Button } from '@/shared/presentation/components/ui/button'
import { FieldError, Label } from '@/shared/presentation/components/ui/label'
import { Input } from '@/shared/presentation/components/ui/input'

const initialState: AdjustStockActionState = { success: false }

export interface AdjustStockFormProps {
  productId: string
  productName: string
  currentQuantity: number
}

export function AdjustStockForm({ productId, productName, currentQuantity }: AdjustStockFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(adjustStockAction, initialState)

  useEffect(() => {
    if (state.success) {
      router.push('/inventory')
    }
  }, [state.success, router])

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <input type="hidden" name="productId" value={productId} />

      <div className="rounded-default border border-line bg-paper-raised p-4">
        <p className="text-sm font-medium text-ink">{productName}</p>
        <p className="mt-1 font-data text-2xl font-semibold text-ink">
          {currentQuantity} <span className="text-sm font-normal text-ink-muted">en stock</span>
        </p>
      </div>

      {state.message && !state.success ? (
        <p className="rounded-default border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      <div>
        <Label htmlFor="quantityDelta">Cantidad</Label>
        <Input
          id="quantityDelta"
          name="quantityDelta"
          type="number"
          step="1"
          placeholder="Positivo para entrada, negativo para salida (ej. -5)"
          required
        />
        <FieldError messages={state.fieldErrors?.quantityDelta} />
        <p className="mt-1 text-xs text-ink-muted">
          Usa un número positivo para agregar stock, negativo para descontar.
        </p>
      </div>

      <div>
        <Label htmlFor="note">Nota</Label>
        <Input id="note" name="note" placeholder="Ej. conteo físico, mercancía dañada..." />
        <FieldError messages={state.fieldErrors?.note} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Guardando…' : 'Ajustar stock'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
