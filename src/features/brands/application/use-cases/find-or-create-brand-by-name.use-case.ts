import { Brand } from '@/features/brands/domain/entities/brand'
import { DuplicateBrandNameError } from '@/features/brands/domain/errors/duplicate-brand-name.error'
import { BrandRepository } from '@/features/brands/domain/repositories/brand.repository'
import { IdGenerator } from '@/shared/ids/id-generator'

export interface FindOrCreateBrandByNameDto {
  name: string
}

export class FindOrCreateBrandByNameUseCase {
  constructor(
    private readonly repository: BrandRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(dto: FindOrCreateBrandByNameDto): Promise<{ id: string }> {
    const name = dto.name.trim()

    const existing = await this.repository.findByName(name)

    if (existing) {
      return { id: existing.id }
    }

    const now = new Date()

    const brand = Brand.create({
      id: this.idGenerator.generateId(),
      name,
      createdAt: now,
      updatedAt: now,
    })

    try {
      await this.repository.save(brand)
    } catch (error) {
      // Condición de carrera: entre nuestro findByName y save, alguien más
      // creó una marca con el mismo nombre (el índice único de la BD lo
      // atrapa). En vez de tronar, usamos la que ya quedó guardada.
      if (error instanceof DuplicateBrandNameError) {
        const raceWinner = await this.repository.findByName(name)

        if (raceWinner) {
          return { id: raceWinner.id }
        }
      }

      throw error
    }

    return { id: brand.id }
  }
}
