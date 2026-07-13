'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

import { authClient } from '@/shared/infrastructure/auth/auth-client'

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex items-center gap-2.5 rounded-default px-2.5 py-2 text-sm text-nav-muted transition-colors hover:bg-nav-line hover:text-nav-foreground"
    >
      <LogOut className="h-4 w-4" />
      Cerrar sesión
    </button>
  )
}
