import { PackageSearch } from 'lucide-react'

import { createInventoryContainer } from '@/features/inventory/infrastructure/container'
import { createProductsContainer } from '@/features/products/infrastructure/container'
import { getRequestContext } from '@/shared/infrastructure/auth/get-request-context'
import { Badge } from '@/shared/presentation/components/ui/badge'
import { LinkButton } from '@/shared/presentation/components/ui/link-button'
import { Topbar } from '@/shared/presentation/components/layout/topbar'

export default async function InventoryPage() {
  const context = await getRequestContext()
  const inventoryContainer = createInventoryContainer(context)
  const productsContainer = createProductsContainer(context)

  const [stocks, productsResult] = await Promise.all([
    inventoryContainer.listStockUseCase.execute(),
    // TODO: cuando el catálogo crezca mucho, esto necesita su propia
    // paginación en vez de pedir "todo" con un límite alto.
    productsContainer.listProductsUseCase.execute({ page: 1, limit: 1000 }),
  ])

  const quantityByProductId = new Map(stocks.map((stock) => [stock.productId, stock.quantity]))
  const trackedProducts = productsResult.items.filter((product) => product.trackInventory)

  return (
    <>
      <Topbar title="Inventario" />

      <main className="flex-1 overflow-y-auto p-6">
        {trackedProducts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-hidden rounded-default border border-line bg-paper-raised">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Producto</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {trackedProducts.map((product) => {
                  const quantity = quantityByProductId.get(product.id) ?? 0

                  return (
                    <tr key={product.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 font-data text-ink-muted">{product.sku}</td>
                      <td className="px-4 py-3 font-medium text-ink">{product.name}</td>
                      <td className="px-4 py-3">
                        <Badge variant={quantity > 0 ? 'accent' : 'warning'}>
                          {quantity} en stock
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <LinkButton
                          href={`/inventory/${product.id}/adjust`}
                          variant="outline"
                          size="sm"
                        >
                          Ajustar
                        </LinkButton>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-default border border-dashed border-line bg-paper-raised py-16 text-center">
      <PackageSearch className="h-8 w-8 text-ink-muted" />
      <p className="mt-3 text-sm font-medium text-ink">No hay productos con inventario rastreado</p>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">
        Los productos marcados como &quot;Servicio&quot; o con seguimiento de inventario desactivado
        no aparecen aquí.
      </p>
    </div>
  )
}
