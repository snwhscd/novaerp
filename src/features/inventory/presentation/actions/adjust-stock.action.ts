'use server'

import { revalidatePath } from 'next/cache'

import { InventoryMovementReason } from '@/features/inventory/domain/enums/inventory-movement-reason'
import { createInventoryContainer } from '@/features/inventory/infrastructure/container'
import { adjustStockSchema } from '@/features/inventory/presentation/schemas/adjust-stock.schema'
import { DomainError } from '@/shared/domain/errors/domain-error'
import { getRequestContext } from '@/shared/infrastructure/auth/get-request-context'

export interface AdjustStockActionState {
  success: boolean
  message?: string
  fieldErrors?: Record<string, string[]>
  newQuantity?: number
}

export async function adjustStockAction(
  _prevState: AdjustStockActionState,
  formData: FormData,
): Promise<AdjustStockActionState> {
  const parsed = adjustStockSchema.safeParse({
    productId: formData.get('productId'),
    quantityDelta: formData.get('quantityDelta'),
    note: formData.get('note'),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: 'Revisa los campos marcados.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const context = await getRequestContext()
    const inventoryContainer = createInventoryContainer(context)

    const result = await inventoryContainer.adjustStockUseCase.execute({
      productId: parsed.data.productId,
      quantityDelta: parsed.data.quantityDelta,
      // Este form es siempre un ajuste manual -- cuando exista Sales/
      // Purchases, esos van a llamar el mismo use case con
      // reason: SALE / PURCHASE desde su propio Server Action, no desde
      // este.
      reason: InventoryMovementReason.MANUAL_ADJUSTMENT,
      note: parsed.data.note || undefined,
    })

    revalidatePath('/inventory')

    return { success: true, newQuantity: result.newQuantity }
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, message: error.message }
    }

    throw error
  }
}
