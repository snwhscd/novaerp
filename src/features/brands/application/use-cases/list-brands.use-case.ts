import { Brand } from '@/features/brands/domain/entities/brand'
import { BrandRepository } from '@/features/brands/domain/repositories/brand.repository'

export class ListBrandsUseCase {
  constructor(private readonly repository: BrandRepository) {}

  async execute(): Promise<Brand[]> {
    return this.repository.findAll()
  }
}
