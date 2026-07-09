import { Product, ProductId } from '@/features/products/domain/entities/product'

export interface ProductRepository {
  save(product: Product): Promise<void>

  udpate(product: Product): Promise<void>

  delete(id: ProductId): Promise<void>

  findById(id: ProductId): Promise<Product | null>

  findBySku(sku: string): Promise<Product | null>

  findAll(): Promise<Product[]>
}
