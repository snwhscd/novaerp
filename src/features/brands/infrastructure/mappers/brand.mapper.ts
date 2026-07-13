import type { Brand as PrismaBrand } from '@/generated/prisma/client'

import { Brand } from '@/features/brands/domain/entities/brand'

export class BrandMapper {
  static toDomain(prismaBrand: PrismaBrand): Brand {
    return Brand.reconstitute({
      id: prismaBrand.id,
      name: prismaBrand.name,
      description: prismaBrand.description ?? undefined,
      createdAt: prismaBrand.createdAt,
      updatedAt: prismaBrand.updatedAt,
      deletedAt: prismaBrand.deletedAt ?? undefined,
    })
  }

  static toPersistence(brand: Brand) {
    return {
      id: brand.id,
      name: brand.name,
      description: brand.description ?? null,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
      deletedAt: brand.deletedAt ?? null,
    }
  }
}
