import { Category } from '@/features/categories/domain/entities/category'
import { CategoryRepository } from '@/features/categories/domain/repositories/category.repository'

export class ListCategoriesUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.repository.findAll()
  }
}
