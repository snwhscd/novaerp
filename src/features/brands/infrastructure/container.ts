import { prisma } from '@/shared/infrastructure/prisma/client'
import { UlidIdGenerator } from '@/shared/ids/ulid-id-generator'
import { RequestContext } from '@/shared/application/context/request-context'

import { CreateBrandUseCase } from '@/features/brands/application/use-cases/create-brand.use-case'
import { FindOrCreateBrandByNameUseCase } from '@/features/brands/application/use-cases/find-or-create-brand-by-name.use-case'
import { ListBrandsUseCase } from '@/features/brands/application/use-cases/list-brands.use-case'
import { PrismaBrandRepository } from '@/features/brands/infrastructure/repositories/prisma-brand.repository'

export function createBrandsContainer(context: RequestContext) {
  const brandRepository = new PrismaBrandRepository(prisma, context.organizationId)
  const idGenerator = new UlidIdGenerator()

  return {
    brandRepository,

    createBrandUseCase: new CreateBrandUseCase(
      brandRepository,
      idGenerator,
      context.organizationId,
    ),
    findOrCreateBrandByNameUseCase: new FindOrCreateBrandByNameUseCase(
      brandRepository,
      idGenerator,
      context.organizationId,
    ),
    listBrandsUseCase: new ListBrandsUseCase(brandRepository),
  }
}
