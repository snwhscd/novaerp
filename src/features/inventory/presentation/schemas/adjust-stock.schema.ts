import { z } from 'zod'

export const adjustStockSchema = z.object({
  productId: z.string().trim().min(1),
  quantityDelta: z.coerce
    .number()
    .int('Debe ser un número entero')
    .refine((n) => n !== 0, 'La cantidad no puede ser cero'),
  note: z.string().trim().max(500).optional().or(z.literal('')),
})

export type AdjustStockInput = z.infer<typeof adjustStockSchema>
