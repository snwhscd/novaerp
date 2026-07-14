import { prisma } from '@/shared/infrastructure/prisma/client'
import { UlidIdGenerator } from '@/shared/ids/ulid-id-generator'
import { domainEventDispatcher } from '@/shared/infrastructure/events/dispatcher'

import { CreateCategoryUseCase } from '@/features/categories/application/use-cases/create-category.use-case'
import { FindOrCreateCategoryByNameUseCase } from '@/features/categories/application/use-cases/find-or-create-category-by-name.use-case'
import { ListCategoriesUseCase } from '@/features/categories/application/use-cases/list-categories.use-case'
import { PrismaCategoryRepository } from '@/features/categories/infrastructure/repositories/prisma-category.repository'

const categoryRepository = new PrismaCategoryRepository(prisma)
const idGenerator = new UlidIdGenerator()

export const categoriesContainer = {
  categoryRepository,

  createCategoryUseCase: new CreateCategoryUseCase(
    categoryRepository,
    idGenerator,
    domainEventDispatcher,
  ),
  findOrCreateCategoryByNameUseCase: new FindOrCreateCategoryByNameUseCase(
    categoryRepository,
    idGenerator,
    domainEventDispatcher,
  ),
  listCategoriesUseCase: new ListCategoriesUseCase(categoryRepository),
}
