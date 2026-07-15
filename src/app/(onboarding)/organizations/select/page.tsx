'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { authClient } from '@/shared/infrastructure/auth/auth-client'

export default function SelectOrganizationPage() {
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function resolveActiveOrganization() {
      const { data: organizations, error } = await authClient.organization.list()

      if (cancelled) return

      if (error || !organizations || organizations.length === 0) {
        // De verdad no tiene ninguna empresa todavía -- este es el único
        // caso real de "primera vez".
        router.replace('/organizations/new')
        return
      }

      // Tiene al menos una empresa, pero la sesión nueva no trae ninguna
      // activa (Better Auth siempre arranca en null al iniciar sesión).
      // Por ahora activamos la primera sin preguntar -- todavía no hay un
      // selector para cuando el usuario pertenece a 2+ empresas. Cuando
      // eso importe de verdad, aquí es donde se agrega el picker.
      const { error: activateError } = await authClient.organization.setActive({
        organizationId: organizations[0].id,
      })

      if (cancelled) return

      if (activateError) {
        router.replace('/organizations/new')
        return
      }

      router.replace('/')
    }

    resolveActiveOrganization()

    return () => {
      cancelled = true
    }
  }, [router])

  return <p className="text-center text-sm text-ink-muted">Cargando tu empresa…</p>
}
