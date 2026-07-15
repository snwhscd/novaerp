import type { PrismaClient } from '@/generated/prisma/client'

import { Brand, BrandId } from '@/features/brands/domain/entities/brand'
import { DuplicateBrandNameError } from '@/features/brands/domain/errors/duplicate-brand-name.error'
import { BrandRepository } from '@/features/brands/domain/repositories/brand.repository'
import { BrandMapper } from '@/features/brands/infrastructure/mappers/brand.mapper'
import { isPrismaKnownError, PRISMA_ERROR_CODE } from '@/shared/infrastructure/prisma/prisma-error'

export class PrismaBrandRepository implements BrandRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly organizationId: string,
  ) {}

  async save(brand: Brand): Promise<void> {
    this.assertSameOrganization(brand)

    try {
      await this.prisma.brand.create({ data: BrandMapper.toPersistence(brand) })
    } catch (error) {
      throw this.translateError(error, brand.name)
    }
  }

  async update(brand: Brand): Promise<void> {
    this.assertSameOrganization(brand)

    const { id, ...data } = BrandMapper.toPersistence(brand)

    try {
      await this.prisma.brand.update({
        where: { id, organizationId: this.organizationId },
        data,
      })
    } catch (error) {
      throw this.translateError(error, brand.name)
    }
  }

  async delete(id: BrandId): Promise<void> {
    await this.prisma.brand.update({
      where: { id, organizationId: this.organizationId },
      data: { deletedAt: new Date() },
    })
  }

  async findById(id: BrandId): Promise<Brand | null> {
    const record = await this.prisma.brand.findFirst({
      where: { id, organizationId: this.organizationId, deletedAt: null },
    })

    return record ? BrandMapper.toDomain(record) : null
  }

  async findByName(name: string): Promise<Brand | null> {
    const record = await this.prisma.brand.findFirst({
      where: { name, organizationId: this.organizationId, deletedAt: null },
    })

    return record ? BrandMapper.toDomain(record) : null
  }

  async findAll(): Promise<Brand[]> {
    const records = await this.prisma.brand.findMany({
      where: { organizationId: this.organizationId, deletedAt: null },
      orderBy: { name: 'asc' },
    })

    return records.map(BrandMapper.toDomain)
  }

  private assertSameOrganization(brand: Brand): void {
    if (brand.organizationId !== this.organizationId) {
      throw new Error(
        `PrismaBrandRepository scoped to ${this.organizationId} received a Brand from ${brand.organizationId}`,
      )
    }
  }

  private translateError(error: unknown, brandName: string): unknown {
    const isUniqueConstraintViolation =
      isPrismaKnownError(error) && error.code === PRISMA_ERROR_CODE.UNIQUE_CONSTRAINT_VIOLATION

    return isUniqueConstraintViolation ? new DuplicateBrandNameError(brandName) : error
  }
}
