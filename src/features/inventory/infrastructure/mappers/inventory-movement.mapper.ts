import type { InventoryMovement as PrismaInventoryMovement } from '@/generated/prisma/client'

import { InventoryMovement } from '@/features/inventory/domain/entities/inventory-movement'

export class InventoryMovementMapper {
  static toDomain(record: PrismaInventoryMovement): InventoryMovement {
    return InventoryMovement.reconstitute({
      id: record.id,
      organizationId: record.organizationId,
      productId: record.productId,
      quantityDelta: record.quantityDelta,
      reason: record.reason,
      note: record.note ?? undefined,
      createdAt: record.createdAt,
    })
  }

  static toPersistence(movement: InventoryMovement) {
    return {
      id: movement.id,
      organizationId: movement.organizationId,
      productId: movement.productId,
      quantityDelta: movement.quantityDelta,
      reason: movement.reason,
      note: movement.note ?? null,
      createdAt: movement.createdAt,
    }
  }
}
