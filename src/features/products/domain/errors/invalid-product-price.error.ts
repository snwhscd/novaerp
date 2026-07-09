import { DomainError } from '@/features/products/domain/errors/abstract-domain.error'

export class InvalidProductPriceError extends DomainError {
  constructor() {
    super('Product price cannot be negative')
  }
}
