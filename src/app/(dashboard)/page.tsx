import { brandsContainer } from '@/features/brands/infrastructure/container'
import { categoriesContainer } from '@/features/categories/infrastructure/container'
import { productsContainer } from '@/features/products/infrastructure/container'
import { SummaryLinkCard } from '@/shared/presentation/components/dashboard/summary-link-card'
import { Topbar } from '@/shared/presentation/components/layout/topbar'
import { FolderTree, Package, Tag } from 'lucide-react'

export default async function DashboardHomePage() {
  const [productsResult, brands, categories] = await Promise.all([
    productsContainer.listProductsUseCase.execute({ page: 1, limit: 1 }),
    brandsContainer.listBrandsUseCase.execute(),
    categoriesContainer.listCategoriesUseCase.execute(),
  ])
  return (
    <>
      <Topbar title="Resumen" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid max-w 2xl grid-cols-1 gap-3 sm:grid-cols-2">
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
