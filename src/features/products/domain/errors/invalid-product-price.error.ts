import { DomainError } from '@/shared/domain/errors/domain-error'

export class InvalidProductPriceError extends DomainError {
  constructor() {
    super('Product price cannot be negative')
  }
}
