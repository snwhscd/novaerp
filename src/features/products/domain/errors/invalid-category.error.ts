import { DomainError } from '@/features/products/domain/errors/abstract-domain.error'

export class InvalidCategoryError extends DomainError {
  constructor() {
    super('Category is required')
  }
}
