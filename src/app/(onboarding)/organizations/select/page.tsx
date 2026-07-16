'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { resolveActiveOrganizationAction } from '@/features/organizations/presentation/actions/resolve-active-organization.action'

export default function SelectOrganizationPage() {
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function resolve() {
      const result = await resolveActiveOrganizationAction()

      if (cancelled) return

      switch (result.outcome) {
        case 'activated':
          router.replace('/')
          router.refresh()
          break
        case 'has-pending-invitations':
          router.replace('/invitations')
          break
        case 'no-organizations':
          router.replace('/organizations/new')
          break
        case 'no-session':
          router.replace('/sign-in')
          break
      }
    }

    resolve()

    return () => {
      cancelled = true
    }
  }, [router])

  return <p className="text-center text-sm text-ink-muted">Cargando tu empresa…</p>
}
