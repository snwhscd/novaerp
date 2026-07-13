import { CreateBrandDto } from '@/features/brands/application/dtos/create-brand.dto'
import { Brand } from '@/features/brands/domain/entities/brand'
import { DuplicateBrandNameError } from '@/features/brands/domain/errors/duplicate-brand-name.error'
import { BrandRepository } from '@/features/brands/domain/repositories/brand.repository'
import { IdGenerator } from '@/shared/ids/id-generator'

export class CreateBrandUseCase {
  constructor(
    private readonly repository: BrandRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(dto: CreateBrandDto): Promise<{ id: string }> {
    const existing = await this.repository.findByName(dto.name)

    if (existing) {
      throw new DuplicateBrandNameError(dto.name)
    }

    const now = new Date()

    const brand = Brand.create({
      id: this.idGenerator.generateId(),
      name: dto.name,
      description: dto.description,
      createdAt: now,
      updatedAt: now,
    })

    await this.repository.save(brand)

    return { id: brand.id }
  }
}
