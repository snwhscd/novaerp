import { type LabelHTMLAttributes } from 'react'

import { cn } from '@/shared/presentation/utils/cn'

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-ink', className)} {...props} />
}

export function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null

  return <p className="mt-1 text-xs text-danger">{messages[0]}</p>
}
