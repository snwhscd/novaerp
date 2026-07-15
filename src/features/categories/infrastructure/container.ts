import { prisma } from '@/shared/infrastructure/prisma/client'
import { UlidIdGenerator } from '@/shared/ids/ulid-id-generator'
import { domainEventDispatcher } from '@/shared/infrastructure/events/dispatcher'
import { RequestContext } from '@/shared/application/context/request-context'

import { CreateCategoryUseCase } from '@/features/categories/application/use-cases/create-category.use-case'
import { FindOrCreateCategoryByNameUseCase } from '@/features/categories/application/use-cases/find-or-create-category-by-name.use-case'
import { ListCategoriesUseCase } from '@/features/categories/application/use-cases/list-categories.use-case'
import { PrismaCategoryRepository } from '@/features/categories/infrastructure/repositories/prisma-category.repository'

// Ya NO es un singleton -- antes era `export const categoriesContainer = {...}`,
// construido UNA vez cuando arrancaba el servidor. Ahora cada request
// construye el suyo, scoped a su propia organización. Ver el diagrama que
// armamos: Server Action -> RequestContext -> este factory -> repositorio
// ya filtrado por esa empresa específica.
export function createCategoriesContainer(context: RequestContext) {
  const categoryRepository = new PrismaCategoryRepository(prisma, context.organizationId)
  const idGenerator = new UlidIdGenerator()

  return {
    categoryRepository,

    createCategoryUseCase: new CreateCategoryUseCase(
      categoryRepository,
      idGenerator,
      domainEventDispatcher,
      context.organizationId,
    ),
    findOrCreateCategoryByNameUseCase: new FindOrCreateCategoryByNameUseCase(
      categoryRepository,
      idGenerator,
      domainEventDispatcher,
      context.organizationId,
    ),
    listCategoriesUseCase: new ListCategoriesUseCase(categoryRepository),
  }
}
