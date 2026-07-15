import { DomainError } from '@/shared/domain/errors/domain-error'

export class InsufficientStockError extends DomainError {
  constructor(productId: string, available: number, requested: number) {
    super(`Product ${productId} has ${available} units in stock, cannot decrease by ${requested}`)
  }
}
