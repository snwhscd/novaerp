import { Category } from '@/features/categories/domain/entities/category'
import { DuplicateCategoryNameError } from '@/features/categories/domain/errors/duplicate-category-name.error'
import { CategoryRepository } from '@/features/categories/domain/repositories/category.repository'
import { DomainEventDispatcher } from '@/shared/application/events/domain-event-dispatcher'
import { IdGenerator } from '@/shared/ids/id-generator'

export interface FindOrCreateCategoryByNameDto {
  name: string
}

export class FindOrCreateCategoryByNameUseCase {
  constructor(
    private readonly repository: CategoryRepository,
    private readonly idGenerator: IdGenerator,
    private readonly eventDispatcher: DomainEventDispatcher,
  ) {}

  async execute(dto: FindOrCreateCategoryByNameDto): Promise<{ id: string }> {
    const name = dto.name.trim()

    const existing = await this.repository.findByName(name)

    if (existing) {
      return { id: existing.id }
    }

    const now = new Date()

    const category = Category.create({
      id: this.idGenerator.generateId(),
      name,
      createdAt: now,
      updatedAt: now,
    })

    try {
      await this.repository.save(category)
    } catch (error) {
      if (error instanceof DuplicateCategoryNameError) {
        const raceWinner = await this.repository.findByName(name)

        if (raceWinner) {
          // Perdimos la carrera: la categoría la creó otra request, no
          // esta. No despachamos "category.created" -- nosotros no
          // creamos nada de verdad.
          return { id: raceWinner.id }
        }
      }

      throw error
    }

    await this.eventDispatcher.dispatch(category.pullDomainEvents())

    return { id: category.id }
  }
}
