import { CreateCategoryDto } from '@/features/categories/application/dtos/create-category.dto'
import { Category } from '@/features/categories/domain/entities/category'
import { DuplicateCategoryNameError } from '@/features/categories/domain/errors/duplicate-category-name.error'
import { CategoryRepository } from '@/features/categories/domain/repositories/category.repository'
import { DomainEventDispatcher } from '@/shared/application/events/domain-event-dispatcher'
import { IdGenerator } from '@/shared/ids/id-generator'

export class CreateCategoryUseCase {
  constructor(
    private readonly repository: CategoryRepository,
    private readonly idGenerator: IdGenerator,
    private readonly eventDispatcher: DomainEventDispatcher,
  ) {}

  async execute(dto: CreateCategoryDto): Promise<{ id: string }> {
    const existing = await this.repository.findByName(dto.name)

    if (existing) {
      throw new DuplicateCategoryNameError(dto.name)
    }

    const now = new Date()

    const category = Category.create({
      id: this.idGenerator.generateId(),
      name: dto.name,
      description: dto.description,
      createdAt: now,
      updatedAt: now,
    })

    await this.repository.save(category)

    // Se despachan DESPUÉS de guardar -- si save() falla, no queremos
    // haber avisado de un hecho que en realidad no ocurrió.
    await this.eventDispatcher.dispatch(category.pullDomainEvents())

    return { id: category.id }
  }
}
