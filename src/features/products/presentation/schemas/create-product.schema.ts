import { z } from 'zod'

import { ProductType } from '@/features/products/domain/enums/product-type'

// Sentinel usado en el <select> de marca para indicar "el usuario quiere
// crear una marca nueva" en vez de elegir una existente.
export const NEW_BRAND_OPTION_VALUE = '__new__'

// Mismo patrón para categoría.
export const NEW_CATEGORY_OPTION_VALUE = '__new__'

// Esta validación vive en presentación, NO en el dominio.
// El dominio valida invariantes de negocio (Product.validate);
// este schema valida forma/tipo de los datos que llegan del cliente.
export const createProductSchema = z
  .object({
    sku: z.string().trim().min(1).optional().or(z.literal('')),
    barcode: z.string().trim().optional().or(z.literal('')),

    name: z.string().trim().min(1, 'El nombre es obligatorio').max(200),
    description: z.string().trim().max(2000).optional().or(z.literal('')),

    productType: z.nativeEnum(ProductType),

    costPrice: z.coerce.number().min(0, 'El costo no puede ser negativo'),
    salePrice: z.coerce.number().min(0, 'El precio de venta no puede ser negativo'),

    trackInventory: z.coerce.boolean().default(true),

    brandId: z.string().trim().optional().or(z.literal('')),
    newBrandName: z.string().trim().max(120).optional().or(z.literal('')),

    categoryId: z.string().trim().min(1, 'La categoría es obligatoria'),
    newCategoryName: z.string().trim().max(120).optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.brandId === NEW_BRAND_OPTION_VALUE && !data.newBrandName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Escribe el nombre de la nueva marca',
        path: ['newBrandName'],
      })
    }

    if (data.categoryId === NEW_CATEGORY_OPTION_VALUE && !data.newCategoryName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Escribe el nombre de la nueva categoría',
        path: ['newCategoryName'],
      })
    }
  })

export type CreateProductInput = z.infer<typeof createProductSchema>
