import { DomainError } from '@/shared/domain/errors/domain-error'

export class DuplicateBrandNameError extends DomainError {
  constructor(name: string) {
    super(`A brand named "${name}" already exists`)
  }
}
