'use server'

import { revalidatePath } from 'next/cache'

import { categoriesContainer } from '@/features/categories/infrastructure/container'
import { createCategorySchema } from '@/features/categories/presentation/schemas/create-category.schema'
import { DomainError } from '@/shared/domain/errors/domain-error'

export interface CreateCategoryActionState {
  success: boolean
  message?: string
  fieldErrors?: Record<string, string[]>
  categoryId?: string
}

export async function createCategoryAction(
  _prevState: CreateCategoryActionState,
  formData: FormData,
): Promise<CreateCategoryActionState> {
  const parsed = createCategorySchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: 'Revisa los campos marcados.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const result = await categoriesContainer.createCategoryUseCase.execute({
      name: parsed.data.name,
      description: parsed.data.description || undefined,
    })

    revalidatePath('/categories')
    revalidatePath('/products/new')

    return { success: true, categoryId: result.id }
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, message: error.message }
    }

    throw error
  }
}
