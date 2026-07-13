export interface PrismaKnownError {
  code: string
  meta?: Record<string, unknown>
}

// No usamos `instanceof PrismaClientKnownRequestError` a propósito:
// con bundlers (Next.js, Turbopack) el mismo módulo de Prisma a veces se
// carga por dos rutas distintas y el instanceof falla silenciosamente.
// Chequear la forma del objeto es más robusto.
export function isPrismaKnownError(error: unknown): error is PrismaKnownError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string' &&
    /^P\d{4}$/.test((error as { code: string }).code)
  )
}

// Códigos que nos interesa traducir a mensajes de negocio.
// Referencia completa: https://www.prisma.io/docs/orm/reference/error-reference
export const PRISMA_ERROR_CODE = {
  UNIQUE_CONSTRAINT_VIOLATION: 'P2002',
  FOREIGN_KEY_CONSTRAINT_VIOLATION: 'P2003',
  RECORD_NOT_FOUND: 'P2025',
} as const
