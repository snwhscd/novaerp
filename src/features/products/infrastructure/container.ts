import { prisma } from '@/shared/infrastructure/prisma/client'
import { UlidIdGenerator } from '@/shared/ids/ulid-id-generator'

import { CreateProductUseCase } from '@/features/products/application/use-cases/create-product.use-case'
import { ListProductsUseCase } from '@/features/products/application/use-cases/list-products.use-case'
import { PrismaProductRepository } from '@/features/products/infrastructure/repositories/prisma-product.repository'
import { DefaultSkuGenerator } from '@/features/products/infrastructure/services/default-sku-generator'

// Composition root: único lugar donde se conocen las implementaciones concretas.
// La capa de presentación solo debe importar desde aquí, nunca instanciar
// repositorios o servicios de infraestructura directamente.

const productRepository = new PrismaProductRepository(prisma)
const idGenerator = new UlidIdGenerator()
const skuGenerator = new DefaultSkuGenerator()

export const productsContainer = {
  productRepository,

  createProductUseCase: new CreateProductUseCase(productRepository, idGenerator, skuGenerator),
  listProductsUseCase: new ListProductsUseCase(productRepository),
}
