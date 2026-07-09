import { DomainError } from '@/features/products/domain/errors/abstract-domain.error'

export class DuplicateSkuError extends DomainError {
  constructor(sku: string) {
    super(`A product with SKU "${sku}" already exists.`)
  }
}
