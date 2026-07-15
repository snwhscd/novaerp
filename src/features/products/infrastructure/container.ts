import { prisma } from '@/shared/infrastructure/prisma/client'
import { UlidIdGenerator } from '@/shared/ids/ulid-id-generator'
import { RequestContext } from '@/shared/application/context/request-context'

import { CreateProductUseCase } from '@/features/products/application/use-cases/create-product.use-case'
import { GetProductByIdUseCase } from '@/features/products/application/use-cases/get-product-by-id.use-case'
import { ListProductsUseCase } from '@/features/products/application/use-cases/list-products.use-case'
import { PrismaProductRepository } from '@/features/products/infrastructure/repositories/prisma-product.repository'
import { DefaultSkuGenerator } from '@/features/products/infrastructure/services/default-sku-generator'

// Composition root: único lugar donde se conocen las implementaciones concretas.
// La capa de presentación solo debe importar desde aquí, nunca instanciar
// repositorios o servicios de infraestructura directamente.
//
// Ya NO es un singleton -- cada request construye el suyo, scoped a su
// propia organización (mismo patrón que categories y brands).
export function createProductsContainer(context: RequestContext) {
  const productRepository = new PrismaProductRepository(prisma, context.organizationId)
  const idGenerator = new UlidIdGenerator()
  const skuGenerator = new DefaultSkuGenerator()

  return {
    productRepository,

    createProductUseCase: new CreateProductUseCase(
      productRepository,
      idGenerator,
      skuGenerator,
      context.organizationId,
    ),
    listProductsUseCase: new ListProductsUseCase(productRepository),
    getProductByIdUseCase: new GetProductByIdUseCase(productRepository),
  }
}
