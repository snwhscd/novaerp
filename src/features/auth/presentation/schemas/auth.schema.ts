import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().trim().email('Correo inválido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

export type SignInInput = z.infer<typeof signInSchema>

export const signUpSchema = z.object({
  name: z.string().trim().min(1, 'Tu nombre es obligatorio').max(120),
  email: z.string().trim().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

export type SignUpInput = z.infer<typeof signUpSchema>
