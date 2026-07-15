import type { Category as PrismaCategory } from '@/generated/prisma/client'

import { Category } from '@/features/categories/domain/entities/category'

export class CategoryMapper {
  static toDomain(record: PrismaCategory): Category {
    return Category.reconstitute({
      id: record.id,
      organizationId: record.organizationId,
      name: record.name,
      description: record.description ?? undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt ?? undefined,
    })
  }

  static toPersistence(category: Category) {
    return {
      id: category.id,
      organizationId: category.organizationId,
      name: category.name,
      description: category.description ?? null,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      deletedAt: category.deletedAt ?? null,
    }
  }
}
