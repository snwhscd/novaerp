import { DomainError } from '@/shared/domain/errors/domain-error'

export class InvalidSkuError extends DomainError {
  constructor() {
    super('SKU is required')
  }
}
