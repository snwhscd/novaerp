import { FolderPlus, FolderTree } from 'lucide-react'

import { createCategoriesContainer } from '@/features/categories/infrastructure/container'
import { getRequestContext } from '@/shared/infrastructure/auth/get-request-context'
import { LinkButton } from '@/shared/presentation/components/ui/link-button'
import { Topbar } from '@/shared/presentation/components/layout/topbar'

export default async function CategoriesPage() {
  const context = await getRequestContext()
  const categoriesContainer = createCategoriesContainer(context)

  const categories = await categoriesContainer.listCategoriesUseCase.execute()

  return (
    <>
      <Topbar
        title="Categorías"
        actions={
          <LinkButton href="/categories/new" size="sm">
            <FolderPlus className="h-4 w-4" />
            Nueva categoría
          </LinkButton>
        }
      />

      <main className="flex-1 overflow-y-auto p-6">
        {categories.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-hidden rounded-default border border-line bg-paper-raised">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Descripción</th>
                  <th className="px-4 py-3 font-medium">Creada</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{category.name}</td>
                    <td className="px-4 py-3 text-ink-muted">{category.description || '—'}</td>
                    <td className="px-4 py-3 font-data text-xs text-ink-muted">
                      {category.createdAt.toLocaleDateString('es-MX')}
                    </td>
                  </tr>
                ))}
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
      <FolderTree className="h-8 w-8 text-ink-muted" />
      <p className="mt-3 text-sm font-medium text-ink">Todavía no hay categorías</p>
      <p className="mt-1 text-sm text-ink-muted">
        Necesitas al menos una para poder crear productos.
      </p>
      <LinkButton href="/categories/new" className="mt-4" size="sm">
        <FolderPlus className="h-4 w-4" />
        Nueva categoría
      </LinkButton>
    </div>
  )
}
