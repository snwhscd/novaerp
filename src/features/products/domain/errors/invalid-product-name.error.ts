import { DomainError } from '@/features/products/domain/errors/abstract-domain.error'

export class InvalidProductNameError extends DomainError {
  constructor() {
    super('Product name is required')
  }
}
