import type { PrismaClient } from '@/generated/prisma/client'

import { Category, CategoryId } from '@/features/categories/domain/entities/category'
import { DuplicateCategoryNameError } from '@/features/categories/domain/errors/duplicate-category-name.error'
import { CategoryRepository } from '@/features/categories/domain/repositories/category.repository'
import { CategoryMapper } from '@/features/categories/infrastructure/mappers/category.mapper'
import { isPrismaKnownError, PRISMA_ERROR_CODE } from '@/shared/infrastructure/prisma/prisma-error'

export class PrismaCategoryRepository implements CategoryRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly organizationId: string,
  ) {}

  async save(category: Category): Promise<void> {
    // Defensa extra: si alguien construyera la entidad con un
    // organizationId distinto al de este repositorio (bug de otra capa,
    // no debería pasar nunca), preferimos tronar aquí y no guardar datos
    // cruzados entre empresas.
    this.assertSameOrganization(category)

    const data = CategoryMapper.toPersistence(category)

    try {
      await this.prisma.category.create({ data })
    } catch (error) {
      throw this.translateError(error, category.name)
    }
  }

  async update(category: Category): Promise<void> {
    this.assertSameOrganization(category)

    const { id, ...data } = CategoryMapper.toPersistence(category)

    try {
      await this.prisma.category.update({
        where: { id, organizationId: this.organizationId },
        data,
      })
    } catch (error) {
      throw this.translateError(error, category.name)
    }
  }

  async delete(id: CategoryId): Promise<void> {
    await this.prisma.category.update({
      where: { id, organizationId: this.organizationId },
      data: { deletedAt: new Date() },
    })
  }

  async findById(id: CategoryId): Promise<Category | null> {
    const record = await this.prisma.category.findFirst({
      where: { id, organizationId: this.organizationId, deletedAt: null },
    })

    return record ? CategoryMapper.toDomain(record) : null
  }

  async findByName(name: string): Promise<Category | null> {
    const record = await this.prisma.category.findFirst({
      where: { name, organizationId: this.organizationId, deletedAt: null },
    })

    return record ? CategoryMapper.toDomain(record) : null
  }

  async findAll(): Promise<Category[]> {
    const records = await this.prisma.category.findMany({
      where: { organizationId: this.organizationId, deletedAt: null },
      orderBy: { name: 'asc' },
    })

    return records.map(CategoryMapper.toDomain)
  }

  private assertSameOrganization(category: Category): void {
    if (category.organizationId !== this.organizationId) {
      throw new Error(
        `PrismaCategoryRepository scoped to ${this.organizationId} received a Category from ${category.organizationId}`,
      )
    }
  }

  private translateError(error: unknown, categoryName: string): unknown {
    const isUniqueConstraintViolation =
      isPrismaKnownError(error) && error.code === PRISMA_ERROR_CODE.UNIQUE_CONSTRAINT_VIOLATION

    return isUniqueConstraintViolation ? new DuplicateCategoryNameError(categoryName) : error
  }
}
