'use server'

import { revalidatePath } from 'next/cache'

import { createBrandsContainer } from '@/features/brands/infrastructure/container'
import { createCategoriesContainer } from '@/features/categories/infrastructure/container'
import { DomainError } from '@/shared/domain/errors/domain-error'
import { createProductsContainer } from '@/features/products/infrastructure/container'
import {
  createProductSchema,
  NEW_BRAND_OPTION_VALUE,
  NEW_CATEGORY_OPTION_VALUE,
} from '@/features/products/presentation/schemas/create-product.schema'
import { getRequestContext } from '@/shared/infrastructure/auth/get-request-context'
import { isPrismaKnownError, PRISMA_ERROR_CODE } from '@/shared/infrastructure/prisma/prisma-error'

export interface CreateProductActionState {
  success: boolean
  message?: string
  fieldErrors?: Record<string, string[]>
  productId?: string
}

export async function createProductAction(
  _prevState: CreateProductActionState,
  formData: FormData,
): Promise<CreateProductActionState> {
  const raw = {
    sku: formData.get('sku'),
    barcode: formData.get('barcode'),
    name: formData.get('name'),
    description: formData.get('description'),
    productType: formData.get('productType'),
    costPrice: formData.get('costPrice'),
    salePrice: formData.get('salePrice'),
    trackInventory: formData.get('trackInventory') === 'on',
    // formData.get() devuelve null (no '') cuando el campo no existe en el DOM
    // -- por ejemplo brandId, que todavía no tiene selector en el formulario.
    // Normalizamos a '' para que coincida con lo que el schema espera.
    brandId: formData.get('brandId') ?? '',
    newBrandName: formData.get('newBrandName') ?? '',
    categoryId: formData.get('categoryId') ?? '',
    newCategoryName: formData.get('newCategoryName') ?? '',
  }

  const parsed = createProductSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      success: false,
      message: 'Revisa los campos marcados.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const input = parsed.data

  try {
    const context = await getRequestContext()
    const brandsContainer = createBrandsContainer(context)
    const categoriesContainer = createCategoriesContainer(context)
    const productsContainer = createProductsContainer(context)

    let brandId = input.brandId || undefined

    if (brandId === NEW_BRAND_OPTION_VALUE) {
      // El schema ya garantiza esto vía superRefine, pero TS no lo sabe
      // a partir del tipo inferido -- verificamos explícito en vez de `!`.
      if (!input.newBrandName) {
        return { success: false, message: 'Escribe el nombre de la nueva marca.' }
      }

      const brand = await brandsContainer.findOrCreateBrandByNameUseCase.execute({
        name: input.newBrandName,
      })

      brandId = brand.id
    }

    let categoryId = input.categoryId

    if (categoryId === NEW_CATEGORY_OPTION_VALUE) {
      if (!input.newCategoryName) {
        return { success: false, message: 'Escribe el nombre de la nueva categoría.' }
      }

      const category = await categoriesContainer.findOrCreateCategoryByNameUseCase.execute({
        name: input.newCategoryName,
      })

      categoryId = category.id
    }

    const result = await productsContainer.createProductUseCase.execute({
      sku: input.sku || undefined,
      barcode: input.barcode || undefined,
      name: input.name,
      description: input.description || undefined,
      productType: input.productType,
      costPrice: input.costPrice,
      salePrice: input.salePrice,
      trackInventory: input.trackInventory,
      brandId,
      categoryId,
    })

    revalidatePath('/products')

    return { success: true, productId: result.id }
  } catch (error) {
    // Los errores de dominio son esperables (reglas de negocio) y se muestran al usuario.
    if (error instanceof DomainError) {
      return { success: false, message: error.message }
    }

    // Errores de integridad de datos: también son esperables (el usuario
    // eligió una categoría/marca que no existe, o un SKU/barcode duplicado
    // que la validación de la app no alcanzó a atrapar antes).
    if (isPrismaKnownError(error)) {
      if (error.code === PRISMA_ERROR_CODE.FOREIGN_KEY_CONSTRAINT_VIOLATION) {
        return {
          success: false,
          message:
            'La categoría o marca seleccionada no existe. Verifica el ID e intenta de nuevo.',
        }
      }

      if (error.code === PRISMA_ERROR_CODE.UNIQUE_CONSTRAINT_VIOLATION) {
        return {
          success: false,
          message: 'Ya existe un producto con ese SKU o código de barras.',
        }
      }
    }

    // Cualquier otro error es inesperado: se re-lanza para que Next.js lo
    // trate como error 500 y lo capture tu observabilidad (p.ej. Sentry).
    throw error
  }
}
