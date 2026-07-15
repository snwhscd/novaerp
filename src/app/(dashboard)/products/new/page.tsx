import { Topbar } from '@/shared/presentation/components/layout/topbar'
import { createBrandsContainer } from '@/features/brands/infrastructure/container'
import { createCategoriesContainer } from '@/features/categories/infrastructure/container'
import { CreateProductForm } from '@/features/products/presentation/components/create-product-form'
import { getRequestContext } from '@/shared/infrastructure/auth/get-request-context'

export default async function NewProductPage() {
  const context = await getRequestContext()
  const brandsContainer = createBrandsContainer(context)
  const categoriesContainer = createCategoriesContainer(context)

  const [brands, categories] = await Promise.all([
    brandsContainer.listBrandsUseCase.execute(),
    categoriesContainer.listCategoriesUseCase.execute(),
  ])

  return (
    <>
      <Topbar title="Nuevo producto" />
      <main className="flex-1 overflow-y-auto p-6">
        <CreateProductForm
          brands={brands.map((brand) => ({ id: brand.id, name: brand.name }))}
          categories={categories.map((category) => ({ id: category.id, name: category.name }))}
        />
      </main>
    </>
  )
}
