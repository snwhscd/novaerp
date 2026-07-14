'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { authClient } from '@/shared/infrastructure/auth/auth-client'

const CREATE_NEW_OPTION_VALUE = '__create_new__'

export interface OrganizationOption {
  id: string
  name: string
}

export interface OrganizationSwitcherProps {
  organizations: OrganizationOption[]
  activeOrganizationId: string
}

export function OrganizationSwitcher({
  organizations,
  activeOrganizationId,
}: OrganizationSwitcherProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value

    if (value === CREATE_NEW_OPTION_VALUE) {
      router.push('/organizations/new')
      return
    }

    setError(null)

    startTransition(async () => {
      const { error: switchError } = await authClient.organization.setActive({
        organizationId: value,
      })

      if (switchError) {
        setError(switchError.message ?? 'No pudimos cambiar de empresa.')
        return
      }

      // Todo lo que se renderiza server-side (listados, conteos) depende
      // de la organización activa -- hay que refrescar para que se
      // vuelvan a pedir con el nuevo contexto.
      router.refresh()
    })
  }

  return (
    <div className="border-b border-nav-line px-3 py-3">
      <select
        value={activeOrganizationId}
        onChange={handleChange}
        disabled={isPending}
        className="w-full rounded-default border border-nav-line bg-nav px-2 py-1.5 text-sm text-nav-foreground disabled:opacity-50"
      >
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
        <option value={CREATE_NEW_OPTION_VALUE}>+ Crear nueva empresa</option>
      </select>
      {error ? <p className="mt-1 text-xs text-danger">{error}</p> : null}
    </div>
  )
}
