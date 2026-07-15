import type { Stock as PrismaStock } from '@/generated/prisma/client'

import { Stock } from '@/features/inventory/domain/entities/stock'

export class StockMapper {
  static toDomain(record: PrismaStock): Stock {
    return Stock.reconstitute({
      id: record.id,
      organizationId: record.organizationId,
      productId: record.productId,
      quantity: record.quantity,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    })
  }

  static toPersistence(stock: Stock) {
    return {
      id: stock.id,
      organizationId: stock.organizationId,
      productId: stock.productId,
      quantity: stock.quantity,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    }
  }
}
