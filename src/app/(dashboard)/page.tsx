import { FolderTree, Package, Tag } from 'lucide-react'

import { createBrandsContainer } from '@/features/brands/infrastructure/container'
import { createCategoriesContainer } from '@/features/categories/infrastructure/container'
import { createProductsContainer } from '@/features/products/infrastructure/container'
import { getRequestContext } from '@/shared/infrastructure/auth/get-request-context'
import { SummaryLinkCard } from '@/shared/presentation/components/dashboard/summary-link-card'
import { Topbar } from '@/shared/presentation/components/layout/topbar'

export default async function DashboardHomePage() {
  const context = await getRequestContext()
  const brandsContainer = createBrandsContainer(context)
  const categoriesContainer = createCategoriesContainer(context)
  const productsContainer = createProductsContainer(context)

  // Las tres listas no dependen entre sí, así que las pedimos en paralelo
  // en vez de una tras otra -- mismo patrón que ya usamos en /products/new.
  const [productsResult, brands, categories] = await Promise.all([
    productsContainer.listProductsUseCase.execute({ page: 1, limit: 1 }),
    brandsContainer.listBrandsUseCase.execute(),
    categoriesContainer.listCategoriesUseCase.execute(),
  ])

  return (
    <>
      <Topbar title="Resumen" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          <SummaryLinkCard
            href="/products"
            icon={Package}
            label="Productos"
            description="Gestiona tu catálogo"
            count={productsResult.total}
          />
          <SummaryLinkCard
            href="/brands"
            icon={Tag}
            label="Marcas"
            description="Marcas registradas"
            count={brands.length}
          />
          <SummaryLinkCard
            href="/categories"
            icon={FolderTree}
            label="Categorías"
            description="Categorías registradas"
            count={categories.length}
          />
        </div>
      </main>
    </>
  )
}
