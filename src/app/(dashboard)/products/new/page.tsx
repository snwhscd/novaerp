import { Topbar } from '@/shared/presentation/components/layout/topbar'
import { brandsContainer } from '@/features/brands/infrastructure/container'
import { categoriesContainer } from '@/features/categories/infrastructure/container'
import { CreateProductForm } from '@/features/products/presentation/components/create-product-form'

export default async function NewProductPage() {
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
