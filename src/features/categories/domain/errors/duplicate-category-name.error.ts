import { DomainError } from '@/shared/domain/errors/domain-error'

export class DuplicateCategoryNameError extends DomainError {
  constructor(name: string) {
    super(`A category named "${name}" already exists.`)
  }
}
