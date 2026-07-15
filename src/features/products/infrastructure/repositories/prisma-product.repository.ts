import type { PrismaClient } from '@/generated/prisma/client'

import { Product, ProductId } from '@/features/products/domain/entities/product'
import {
  ProductRepository,
  ProductSearchCriteria,
  ProductSearchResult,
} from '@/features/products/domain/repositories/product.repository'
import { ProductMapper } from '@/features/products/infrastructure/mappers/product.mapper'

export class PrismaProductRepository implements ProductRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly organizationId: string,
  ) {}

  async save(product: Product): Promise<void> {
    this.assertSameOrganization(product)

    const data = ProductMapper.toPersistence(product)

    await this.prisma.product.create({ data })
  }

  async update(product: Product): Promise<void> {
    this.assertSameOrganization(product)

    const { id, ...data } = ProductMapper.toPersistence(product)

    await this.prisma.product.update({
      where: { id, organizationId: this.organizationId },
      data,
    })
  }

  async delete(id: ProductId): Promise<void> {
    await this.prisma.product.update({
      where: { id, organizationId: this.organizationId },
      data: { deletedAt: new Date() },
    })
  }

  async findById(id: ProductId): Promise<Product | null> {
    const record = await this.prisma.product.findFirst({
      where: { id, organizationId: this.organizationId, deletedAt: null },
    })

    return record ? ProductMapper.toDomain(record) : null
  }

  async findBySku(sku: string): Promise<Product | null> {
    const record = await this.prisma.product.findFirst({
      where: { sku, organizationId: this.organizationId, deletedAt: null },
    })

    return record ? ProductMapper.toDomain(record) : null
  }

  async findMany(criteria: ProductSearchCriteria): Promise<ProductSearchResult> {
    const { page, limit, search, categoryId, brandId } = criteria

    const where = {
      organizationId: this.organizationId,
      deletedAt: null,
      ...(categoryId ? { categoryId } : {}),
      ...(brandId ? { brandId } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { sku: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    }

    const [records, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ])

    return {
      items: records.map(ProductMapper.toDomain),
      total,
      page,
      limit,
    }
  }

  async findAll(): Promise<Product[]> {
    const records = await this.prisma.product.findMany({
      where: { organizationId: this.organizationId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    })

    return records.map(ProductMapper.toDomain)
  }

  private assertSameOrganization(product: Product): void {
    if (product.organizationId !== this.organizationId) {
      throw new Error(
        `PrismaProductRepository scoped to ${this.organizationId} received a Product from ${product.organizationId}`,
      )
    }
  }
}
