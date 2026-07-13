import { DomainError } from '@/shared/domain/errors/domain-error'

export class InvalidBrandNameError extends DomainError {
  constructor() {
    super('Brand name is required')
  }
}
