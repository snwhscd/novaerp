import { InventoryMovement } from '@/features/inventory/domain/entities/inventory-movement'

export interface InventoryMovementRepository {
  save(movement: InventoryMovement): Promise<void>

  findByProductId(productId: string): Promise<InventoryMovement[]>
}
