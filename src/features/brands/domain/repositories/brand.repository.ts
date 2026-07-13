import { Brand, BrandId } from '@/features/brands/domain/entities/brand'

export interface BrandRepository {
  save(brand: Brand): Promise<void>

  update(brand: Brand): Promise<void>

  delete(id: BrandId): Promise<void>

  findById(id: BrandId): Promise<Brand | null>

  findByName(name: string): Promise<Brand | null>

  findAll(): Promise<Brand[]>
}
