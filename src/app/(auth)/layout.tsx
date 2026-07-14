import { CenteredShell } from '@/shared/presentation/components/layout/centered-shell'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <CenteredShell>{children}</CenteredShell>
}
