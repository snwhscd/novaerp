import { Tag, TagsIcon } from 'lucide-react'

import { brandsContainer } from '@/features/brands/infrastructure/container'
import { Topbar } from '@/shared/presentation/components/layout/topbar'
import { LinkButton } from '@/shared/presentation/components/ui/link-button'

export default async function BrandsPage() {
  const brands = await brandsContainer.listBrandsUseCase.execute()

  return (
    <>
      <Topbar
        title="Marcas"
        actions={
          <LinkButton href="/brands/new" size="sm">
            <Tag className="h-4 w-4" />
            Nueva marca
          </LinkButton>
        }
      />

      <main className="flex-1 overflow-y-auto p-6">
        {brands.length === 0 ? (
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
                {brands.map((brand) => (
                  <tr key={brand.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{brand.name}</td>
                    <td className="px-4 py-3 text-ink-muted">{brand.description || '—'}</td>
                    <td className="px-4 py-3 font-data text-xs text-ink-muted">
                      {brand.createdAt.toLocaleDateString('es-MX')}
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
      <TagsIcon className="h-8 w-8 text-ink-muted" />
      <p className="mt-3 text-sm font-medium text-ink">Todavía no hay marcas</p>
      <p className="mt-1 text-sm text-ink-muted">
        Puedes crear productos sin marca, pero aquí las tienes centralizadas.
      </p>
      <LinkButton href="/brands/new" className="mt-4" size="sm">
        <Tag className="h-4 w-4" />
        Nueva marca
      </LinkButton>
    </div>
  )
}
