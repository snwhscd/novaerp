import Link, { type LinkProps } from 'next/link'
import { type AnchorHTMLAttributes } from 'react'
import { type VariantProps } from 'class-variance-authority'

import { buttonVariants } from '@/shared/presentation/components/ui/button'
import { cn } from '@/shared/presentation/utils/cn'

export interface LinkButtonProps
  extends
    LinkProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    VariantProps<typeof buttonVariants> {
  disabled?: boolean
}

export function LinkButton({ className, variant, size, disabled, ...props }: LinkButtonProps) {
  return (
    <Link
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      className={cn(
        buttonVariants({ variant, size }),
        disabled && 'pointer-events-none opacity-40',
        className,
      )}
      {...props}
    />
  )
}
