import { notFound } from 'next/navigation'

import { AdjustStockForm } from '@/features/inventory/presentation/components/adjust-stock-form'
import { createInventoryContainer } from '@/features/inventory/infrastructure/container'
import { createProductsContainer } from '@/features/products/infrastructure/container'
import { getRequestContext } from '@/shared/infrastructure/auth/get-request-context'
import { Topbar } from '@/shared/presentation/components/layout/topbar'

export default async function AdjustStockPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params

  const context = await getRequestContext()
  const inventoryContainer = createInventoryContainer(context)
  const productsContainer = createProductsContainer(context)

  const [product, stock] = await Promise.all([
    productsContainer.getProductByIdUseCase.execute(productId),
    inventoryContainer.getStockByProductIdUseCase.execute(productId),
  ])

  if (!product) {
    notFound()
  }

  return (
    <>
      <Topbar title="Ajustar stock" />
      <main className="flex-1 overflow-y-auto p-6">
        <AdjustStockForm
          productId={product.id}
          productName={product.name}
          currentQuantity={stock?.quantity ?? 0}
        />
      </main>
    </>
  )
}
