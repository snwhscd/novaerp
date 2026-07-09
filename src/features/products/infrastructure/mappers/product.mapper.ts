import type { Product as PrismaProduct } from '@/generated/prisma'

import { Product } from '@/features/products/domain/entities/product'

export class ProductMapper {
  static toDomain(prismaProduct: PrismaProduct): Product {
    return Product.reconstitute({
      id: prismaProduct.id,

      sku: prismaProduct.sku,
      barcode: prismaProduct.barcode ?? undefined,

      name: prismaProduct.name,
      description: prismaProduct.description ?? undefined,

      productType: prismaProduct.productType,

      costPrice: Number(prismaProduct.costPrice),
      salePrice: Number(prismaProduct.salePrice),

      trackInventory: prismaProduct.trackInventory,

      brandId: prismaProduct.brandId ?? undefined,
      categoryId: prismaProduct.categoryId,

      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
      deletedAt: prismaProduct.deletedAt ?? undefined,
    })
  }

  static toPersistence(product: Product) {
    return {
      id: product.id,

      sku: product.sku,
      barcode: product.barcode ?? null,

      name: product.name,
      description: product.description ?? null,

      productType: product.productType,

      costPrice: product.costPrice,
      salePrice: product.salePrice,

      trackInventory: product.trackInventory,

      brandId: product.brandId ?? null,
      categoryId: product.categoryId,

      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      deletedAt: product.deletedAt ?? null,
    }
  }
}
