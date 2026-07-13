import { Category, CategoryId } from '@/features/categories/domain/entities/category'

export interface CategoryRepository {
  save(category: Category): Promise<void>

  update(category: Category): Promise<void>

  delete(id: CategoryId): Promise<void>

  findById(id: CategoryId): Promise<Category | null>

  findByName(name: string): Promise<Category | null>

  findAll(): Promise<Category[]>
}
