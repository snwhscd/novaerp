import Link from 'next/link'
import {
  Boxes,
  FolderTree,
  LayoutGrid,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
} from 'lucide-react'

import { SignOutButton } from '@/features/auth/presentation/components/sign-out-button'
import {
  OrganizationSwitcher,
  type OrganizationOption,
} from '@/features/organizations/presentation/components/organization-switcher'

const navSections = [
  {
    label: 'General',
    items: [{ href: '/', label: 'Resumen', icon: LayoutGrid }],
  },
  {
    label: 'Catálogo',
    items: [
      { href: '/products', label: 'Productos', icon: Package },
      { href: '/brands', label: 'Marcas', icon: Tag },
      { href: '/categories', label: 'Categorías', icon: FolderTree },
      { href: '/inventory', label: 'Inventario', icon: Boxes, disabled: true },
    ],
  },
  {
    label: 'Operación',
    items: [
      { href: '/sales', label: 'Ventas', icon: ShoppingCart, disabled: true },
      { href: '/customers', label: 'Clientes', icon: Users, disabled: true },
    ],
  },
]

export interface SidebarUser {
  name: string
  email: string
}

export interface SidebarProps {
  user: SidebarUser
  organizations: OrganizationOption[]
  activeOrganizationId: string
}

export function Sidebar({ user, organizations, activeOrganizationId }: SidebarProps) {
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-nav text-nav-foreground">
      <div className="flex h-14 items-center gap-2 border-b border-nav-line px-5">
        <span className="font-data text-sm font-semibold tracking-tight text-nav-foreground">
          NOVA<span className="text-accent">ERP</span>
        </span>
      </div>

      <OrganizationSwitcher
        organizations={organizations}
        activeOrganizationId={activeOrganizationId}
      />

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-nav-muted">
              {section.label}
            </p>
            <ul className="mt-2 space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon

                if (item.disabled) {
                  return (
                    <li key={item.href}>
                      <span className="flex cursor-not-allowed items-center gap-2.5 rounded-default px-2.5 py-2 text-sm text-nav-muted/60">
                        <Icon className="h-4 w-4" />
                        {item.label}
                        <span className="ml-auto font-data text-[10px] uppercase text-nav-muted/50">
                          pronto
                        </span>
                      </span>
                    </li>
                  )
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2.5 rounded-default px-2.5 py-2 text-sm text-nav-foreground/90 transition-colors hover:bg-nav-line hover:text-nav-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-nav-line p-3">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 rounded-default px-2.5 py-2 text-sm text-nav-muted transition-colors hover:bg-nav-line hover:text-nav-foreground"
        >
          <Settings className="h-4 w-4" />
          Configuración
        </Link>
        <SignOutButton />
      </div>

      <div className="flex items-center gap-2.5 border-t border-nav-line px-3 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-nav-line font-data text-xs font-medium text-nav-foreground">
          {initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm text-nav-foreground">{user.name}</span>
          <span className="block truncate text-xs text-nav-muted">{user.email}</span>
        </span>
      </div>
    </aside>
  )
}
