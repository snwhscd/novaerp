'use client'

import { Check, Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { authClient } from '@/shared/infrastructure/auth/auth-client'
import { Button } from '@/shared/presentation/components/ui/button'
import { Input } from '@/shared/presentation/components/ui/input'
import { Label } from '@/shared/presentation/components/ui/label'
import { Select } from '@/shared/presentation/components/ui/select'

export function InviteMemberForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'member' | 'admin'>('member')
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsPending(true)
    setError(null)
    setInviteUrl(null)

    // El endpoint interno se llama "createInvitation" (así se expone en
    // auth.api.* del lado servidor), pero su ruta real es
    // /organization/invite-member -- el cliente deriva el nombre del
    // método de la RUTA, no del nombre interno, así que aquí es
    // inviteMember. Si no hay un callback sendInvitationEmail
    // configurado (nuestro caso), simplemente no manda nada, sin
    // tronar. El link lo construimos nosotros con el id que regresa.
    const { data, error: inviteError } = await authClient.organization.inviteMember({
      email,
      role,
    })

    setIsPending(false)

    if (inviteError) {
      setError(inviteError.message ?? 'No pudimos generar la invitación.')
      return
    }

    setInviteUrl(`${window.location.origin}/invitations/${data.id}`)
    setEmail('')
    router.refresh()
  }

  const handleCopy = async () => {
    if (!inviteUrl) return

    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-default border border-line bg-paper-raised p-4"
    >
      <div>
        <h2 className="text-sm font-semibold text-ink">Invitar a alguien</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Genera un link y mándaselo tú mismo (WhatsApp, Slack, lo que uses) -- todavía no enviamos
          el correo automático.
        </p>
      </div>

      {error ? (
        <p className="rounded-default border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="invite-email" className="sr-only">
            Correo
          </Label>
          <Input
            id="invite-email"
            type="email"
            required
            placeholder="correo@empresa.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <Select
          value={role}
          onChange={(event) => setRole(event.target.value as 'member' | 'admin')}
          className="w-32"
        >
          <option value="member">Miembro</option>
          <option value="admin">Admin</option>
        </Select>

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Generando…' : 'Invitar'}
        </Button>
      </div>

      {inviteUrl ? (
        <div className="flex items-center gap-2 rounded-default border border-accent/30 bg-accent-soft px-3 py-2">
          <code className="flex-1 truncate text-xs text-ink">{inviteUrl}</code>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 text-accent hover:opacity-80"
            aria-label="Copiar link"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      ) : null}
    </form>
  )
}
