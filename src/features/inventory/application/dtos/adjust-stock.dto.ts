import { InventoryMovementReason } from '@/features/inventory/domain/enums/inventory-movement-reason'

export interface AdjustStockDto {
  productId: string
  // Con signo: positivo = entrada, negativo = salida.
  quantityDelta: number
  reason: InventoryMovementReason
  note?: string
}
