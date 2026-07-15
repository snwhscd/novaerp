import { DomainError } from '@/shared/domain/errors/domain-error'

export class InvalidStockQuantityError extends DomainError {
  constructor() {
    super('Stock quantity must be a positive number')
  }
}
