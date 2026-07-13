import { DomainError } from '@/shared/domain/errors/domain-error'

export class DuplicateSkuError extends DomainError {
  constructor(sku: string) {
    super(`A product with SKU "${sku}" already exists.`)
  }
}
