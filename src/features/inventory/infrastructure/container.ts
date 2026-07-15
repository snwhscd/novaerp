import { prisma } from '@/shared/infrastructure/prisma/client'
import { UlidIdGenerator } from '@/shared/ids/ulid-id-generator'
import { domainEventDispatcher } from '@/shared/infrastructure/events/dispatcher'
import { RequestContext } from '@/shared/application/context/request-context'

import { AdjustStockUseCase } from '@/features/inventory/application/use-cases/adjust-stock.use-case'
import { GetStockByProductIdUseCase } from '@/features/inventory/application/use-cases/get-stock-by-product-id.use-case'
import { ListStockUseCase } from '@/features/inventory/application/use-cases/list-stock.use-case'
import { PrismaInventoryMovementRepository } from '@/features/inventory/infrastructure/repositories/prisma-inventory-movement.repository'
import { PrismaStockRepository } from '@/features/inventory/infrastructure/repositories/prisma-stock.repository'

export function createInventoryContainer(context: RequestContext) {
  const stockRepository = new PrismaStockRepository(prisma, context.organizationId)
  const movementRepository = new PrismaInventoryMovementRepository(prisma, context.organizationId)
  const idGenerator = new UlidIdGenerator()

  return {
    stockRepository,
    movementRepository,

    adjustStockUseCase: new AdjustStockUseCase(
      stockRepository,
      movementRepository,
      idGenerator,
      domainEventDispatcher,
      context.organizationId,
    ),
    listStockUseCase: new ListStockUseCase(stockRepository),
    getStockByProductIdUseCase: new GetStockByProductIdUseCase(stockRepository),
  }
}
