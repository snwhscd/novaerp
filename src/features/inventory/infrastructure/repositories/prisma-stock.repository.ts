import type { PrismaClient } from '@/generated/prisma/client'

import { Stock, StockId } from '@/features/inventory/domain/entities/stock'
import { StockRepository } from '@/features/inventory/domain/repositories/stock.repository'
import { StockMapper } from '@/features/inventory/infrastructure/mappers/stock.mapper'

export class PrismaStockRepository implements StockRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly organizationId: string,
  ) {}

  async save(stock: Stock): Promise<void> {
    this.assertSameOrganization(stock)

    await this.prisma.stock.create({ data: StockMapper.toPersistence(stock) })
  }

  async update(stock: Stock): Promise<void> {
    this.assertSameOrganization(stock)

    const { id, ...data } = StockMapper.toPersistence(stock)

    await this.prisma.stock.update({
      where: { id, organizationId: this.organizationId },
      data,
    })
  }

  async findById(id: StockId): Promise<Stock | null> {
    const record = await this.prisma.stock.findFirst({
      where: { id, organizationId: this.organizationId },
    })

    return record ? StockMapper.toDomain(record) : null
  }

  async findByProductId(productId: string): Promise<Stock | null> {
    const record = await this.prisma.stock.findFirst({
      where: { productId, organizationId: this.organizationId },
    })

    return record ? StockMapper.toDomain(record) : null
  }

  async findAll(): Promise<Stock[]> {
    const records = await this.prisma.stock.findMany({
      where: { organizationId: this.organizationId },
    })

    return records.map(StockMapper.toDomain)
  }

  private assertSameOrganization(stock: Stock): void {
    if (stock.organizationId !== this.organizationId) {
      throw new Error(
        `PrismaStockRepository scoped to ${this.organizationId} received a Stock from ${stock.organizationId}`,
      )
    }
  }
}
