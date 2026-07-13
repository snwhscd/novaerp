import { DomainError } from '@/shared/domain/errors/domain-error'

export class InvalidProductNameError extends DomainError {
  constructor() {
    super('Product name is required')
  }
}
