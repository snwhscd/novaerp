import { Product, ProductId } from '@/features/products/domain/entities/product'

export interface ProductSearchCriteria {
  page: number
  limit: number
  search?: string
  categoryId?: string
  brandId?: string
}

export interface ProductSearchResult {
  items: Product[]
  total: number
  page: number
  limit: number
}

export interface ProductRepository {
  save(product: Product): Promise<void>

  update(product: Product): Promise<void>

  delete(id: ProductId): Promise<void>

  findById(id: ProductId): Promise<Product | null>

  findBySku(sku: string): Promise<Product | null>

  findMany(criteria: ProductSearchCriteria): Promise<ProductSearchResult>

  findAll(): Promise<Product[]>
}
