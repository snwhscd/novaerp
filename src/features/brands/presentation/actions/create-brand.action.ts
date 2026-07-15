'use server'

import { revalidatePath } from 'next/cache'

import { createBrandsContainer } from '@/features/brands/infrastructure/container'
import { createBrandSchema } from '@/features/brands/presentation/schemas/create-brand.schema'
import { getRequestContext } from '@/shared/infrastructure/auth/get-request-context'
import { DomainError } from '@/shared/domain/errors/domain-error'

export interface CreateBrandActionState {
  success: boolean
  message?: string
  fieldErrors?: Record<string, string[]>
  brandId?: string
}

export async function createBrandAction(
  _prevState: CreateBrandActionState,
  formData: FormData,
): Promise<CreateBrandActionState> {
  const parsed = createBrandSchema.safeParse({
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
    const context = await getRequestContext()
    const brandsContainer = createBrandsContainer(context)

    const result = await brandsContainer.createBrandUseCase.execute({
      name: parsed.data.name,
      description: parsed.data.description || undefined,
    })

    revalidatePath('/brands')
    revalidatePath('/products/new')

    return { success: true, brandId: result.id }
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, message: error.message }
    }

    throw error
  }
}
