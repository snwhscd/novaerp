import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY no está definida en .env')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// Dirección "from" centralizada aquí -- nunca la escribas suelta en otro
// archivo. Mientras no verifiques un dominio propio en Resend, esta
// dirección sandbox SOLO entrega al correo de tu propia cuenta de Resend.
export const EMAIL_FROM = process.env.EMAIL_FROM ?? 'NovaERP <onboarding@resend.dev>'
