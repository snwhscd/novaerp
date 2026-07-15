import { PackagePlus, PackageSearch } from 'lucide-react'

import { createProductsContainer } from '@/features/products/infrastructure/container'
import { getRequestContext } from '@/shared/infrastructure/auth/get-request-context'
import { Badge } from '@/shared/presentation/components/ui/badge'
import { LinkButton } from '@/shared/presentation/components/ui/link-button'
import { Topbar } from '@/shared/presentation/components/layout/topbar'

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

const productTypeLabel: Record<string, string> = {
  PHYSICAL: 'Físico',
  SERVICE: 'Servicio',
  DIGITAL: 'Digital',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page ?? '1') || 1

  const context = await getRequestContext()
  const productsContainer = createProductsContainer(context)

  const { items, total, limit } = await productsContainer.listProductsUseCase.execute({ page })

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <>
      <Topbar
        title="Productos"
        actions={
          <LinkButton href="/products/new" size="sm">
            <PackagePlus className="h-4 w-4" />
            Nuevo producto
          </LinkButton>
        }
      />

      <main className="flex-1 overflow-y-auto p-6">
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-hidden rounded-default border border-line bg-paper-raised">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium text-right">Costo</th>
                  <th className="px-4 py-3 font-medium text-right">Precio</th>
                  <th className="px-4 py-3 font-medium">Inventario</th>
                </tr>
              </thead>
              <tbody>
                {items.map((product) => (
                  <tr key={product.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-data text-ink-muted">{product.sku}</td>
                    <td className="px-4 py-3 font-medium text-ink">{product.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant="neutral">{productTypeLabel[product.productType]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-data text-ink-muted">
                      {currencyFormatter.format(product.costPrice)}
                    </td>
                    <td className="px-4 py-3 text-right font-data text-ink">
                      {currencyFormatter.format(product.salePrice)}
                    </td>
                    <td className="px-4 py-3">
                      {product.trackInventory ? (
                        <Badge variant="accent">Rastreado</Badge>
                      ) : (
                        <Badge variant="neutral">No rastreado</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 ? (
          <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
            <span>
              Página {page} de {totalPages} · {total} productos
            </span>
            <div className="flex gap-2">
              <LinkButton
                href={`/products?page=${page - 1}`}
                variant="outline"
                size="sm"
                disabled={page <= 1}
              >
                Anterior
              </LinkButton>
              <LinkButton
                href={`/products?page=${page + 1}`}
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
              >
                Siguiente
              </LinkButton>
            </div>
          </div>
        ) : null}
      </main>
    </>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-default border border-dashed border-line bg-paper-raised py-16 text-center">
      <PackageSearch className="h-8 w-8 text-ink-muted" />
      <p className="mt-3 text-sm font-medium text-ink">Todavía no hay productos</p>
      <p className="mt-1 text-sm text-ink-muted">
        Crea el primero para empezar a construir tu catálogo.
      </p>
      <LinkButton href="/products/new" className="mt-4" size="sm">
        <PackagePlus className="h-4 w-4" />
        Nuevo producto
      </LinkButton>
    </div>
  )
}
