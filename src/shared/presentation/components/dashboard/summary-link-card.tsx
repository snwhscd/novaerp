import { type LucideIcon } from 'lucide-react'
import Link from 'next/link'

export interface SummaryLinkCardProps {
  href: string
  icon: LucideIcon
  label: string
  description: string
  count: number
}

export function SummaryLinkCard({
  href,
  icon: Icon,
  label,
  description,
  count,
}: SummaryLinkCardProps) {
  return (
    <Link
      href={href}
      className="felx items-center gap-3 rounded-default bg-paper-raised p-4 transition-colors hover:border-accent"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-default bg-accent-soft text-accent">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="block text-xs text-ink-muted">{description}</span>
      </span>
      <span className="shrink-0 font-data text-2xl font-semibold text-ink">{count}</span>
    </Link>
  )
}
