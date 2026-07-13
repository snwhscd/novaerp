import {
  ProductRepository,
  ProductSearchResult,
} from '@/features/products/domain/repositories/product.repository'

export interface ListProductsQuery {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  brandId?: string
}

export class ListProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(query: ListProductsQuery = {}): Promise<ProductSearchResult> {
    return this.repository.findMany({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      search: query.search,
      categoryId: query.categoryId,
      brandId: query.brandId,
    })
  }
}
