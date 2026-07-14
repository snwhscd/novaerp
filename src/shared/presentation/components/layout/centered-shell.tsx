export function CenteredShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-data text-lg font-semibold tracking-tight text-ink">
            NOVA<span className="text-accent">ERP</span>
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
