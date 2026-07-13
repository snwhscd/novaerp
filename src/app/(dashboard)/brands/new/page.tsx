import { CreateBrandForm } from '@/features/brands/presentation/components/create-brand-form'
import { Topbar } from '@/shared/presentation/components/layout/topbar'

export default function NewBrandPage() {
  return (
    <>
      <Topbar title="Nueva marca" />
      <main className="flex-1 overflow-y-auto p-6">
        <CreateBrandForm />
      </main>
    </>
  )
}
