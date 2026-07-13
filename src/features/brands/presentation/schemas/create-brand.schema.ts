import z from 'zod'

export const createBrandSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(120),
  description: z.string().trim().max(500).optional().or(z.literal('')),
})

export type CreateBrandInput = z.infer<typeof createBrandSchema>
