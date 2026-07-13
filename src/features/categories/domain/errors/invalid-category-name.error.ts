import { DomainError } from '@/shared/domain/errors/domain-error'

export class InvalidCategoryNameError extends DomainError {
  constructor() {
    super('Category name is required')
  }
}
