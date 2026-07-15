import type { PrismaClient } from '@/generated/prisma/client'

import { InventoryMovement } from '@/features/inventory/domain/entities/inventory-movement'
import { InventoryMovementRepository } from '@/features/inventory/domain/repositories/inventory-movement.repository'
import { InventoryMovementMapper } from '@/features/inventory/infrastructure/mappers/inventory-movement.mapper'

export class PrismaInventoryMovementRepository implements InventoryMovementRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly organizationId: string,
  ) {}

  async save(movement: InventoryMovement): Promise<void> {
    if (movement.organizationId !== this.organizationId) {
      throw new Error(
        `PrismaInventoryMovementRepository scoped to ${this.organizationId} received a movement from ${movement.organizationId}`,
      )
    }

    await this.prisma.inventoryMovement.create({
      data: InventoryMovementMapper.toPersistence(movement),
    })
  }

  async findByProductId(productId: string): Promise<InventoryMovement[]> {
    const records = await this.prisma.inventoryMovement.findMany({
      where: { productId, organizationId: this.organizationId },
      orderBy: { createdAt: 'desc' },
    })

    return records.map(InventoryMovementMapper.toDomain)
  }
}
