import { Product } from '@/features/products/domain/entities/product'
import { ProductRepository } from '@/features/products/domain/repositories/product.repository'

export class GetProductByIdUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    return this.repository.findById(id)
  }
}
