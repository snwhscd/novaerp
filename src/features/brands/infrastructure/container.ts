import { prisma } from '@/shared/infrastructure/prisma/client'
import { UlidIdGenerator } from '@/shared/ids/ulid-id-generator'

import { CreateBrandUseCase } from '@/features/brands/application/use-cases/create-brand.use-case'
import { FindOrCreateBrandByNameUseCase } from '@/features/brands/application/use-cases/find-or-create-brand-by-name.use-case'
import { ListBrandsUseCase } from '@/features/brands/application/use-cases/list-brands.use-case'
import { PrismaBrandRepository } from '@/features/brands/infrastructure/repositories/prisma-brand.repository'

const brandRepository = new PrismaBrandRepository(prisma)
const idGenerator = new UlidIdGenerator()

export const brandsContainer = {
  brandRepository,

  createBrandUseCase: new CreateBrandUseCase(brandRepository, idGenerator),
  findOrCreateBrandByNameUseCase: new FindOrCreateBrandByNameUseCase(brandRepository, idGenerator),
  listBrandsUseCase: new ListBrandsUseCase(brandRepository),
}
