import { DomainError } from '@/shared/domain/errors/domain-error'

export class InvalidCategoryError extends DomainError {
  constructor() {
    super('Category is required')
  }
}
