import { DomainError } from '@/features/products/domain/errors/abstract-domain.error'

export class InvalidSkuError extends DomainError {
  constructor() {
    super('SKU is required')
  }
}
