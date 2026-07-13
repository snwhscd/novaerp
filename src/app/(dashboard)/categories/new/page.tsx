import { Topbar } from '@/shared/presentation/components/layout/topbar'
import { CreateCategoryForm } from '@/features/categories/presentation/components/create-category-form'

export default function NewCategoryPage() {
  return (
    <>
      <Topbar title="Nueva categoría" />
      <main className="flex-1 overflow-y-auto p-6">
        <CreateCategoryForm />
      </main>
    </>
  )
}
