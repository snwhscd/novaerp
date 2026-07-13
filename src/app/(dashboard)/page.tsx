import Link from 'next/link'
import { Package } from 'lucide-react'

import { Topbar } from '@/shared/presentation/components/layout/topbar'

export default function DashboardHomePage() {
  return (
    <>
      <Topbar title="Resumen" />
      <main className="flex-1 overflow-y-auto p-6">
        <Link
          href="/products"
          className="flex max-w-sm items-center gap-3 rounded-default border border-line bg-paper-raised p-4 transition-colors hover:border-accent"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-default bg-accent-soft text-accent">
            <Package className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-medium text-ink">Productos</span>
            <span className="block text-xs text-ink-muted">Gestiona tu catálogo</span>
          </span>
        </Link>
      </main>
    </>
  )
}
