import { AggregateRoot } from '@/shared/domain/aggregate-root'
import { CategoryCreatedEvent } from '@/features/categories/domain/events/category-created.event'
import { CategoryDeletedEvent } from '@/features/categories/domain/events/category-deleted.event'
import { CategoryRenamedEvent } from '@/features/categories/domain/events/category-renamed.event'
import { InvalidCategoryNameError } from '@/features/categories/domain/errors/invalid-category-name.error'

export type CategoryId = string

export interface CreateCategoryProps {
  id: CategoryId
  organizationId: string

  name: string
  description?: string

  createdAt: Date
  updatedAt: Date
}

export interface CategoryProps extends CreateCategoryProps {
  deletedAt?: Date
}

export class Category extends AggregateRoot {
  private constructor(private props: CategoryProps) {
    super()
  }

  static create(props: CreateCategoryProps): Category {
    this.validateName(props.name)

    const category = new Category({ ...props, deletedAt: undefined })

    category.addDomainEvent(
      new CategoryCreatedEvent({
        id: category.id,
        name: category.name,
        description: category.description,
      }),
    )

    return category
  }

  // reconstitute() NO emite eventos: es cargar una fila que ya existía en
  // la BD, no un hecho de negocio nuevo. Si emitiera eventos, cada vez que
  // hicieras un findById() dispararías un "category.created" falso.
  static reconstitute(props: CategoryProps): Category {
    return new Category(props)
  }

  private static validateName(name: string): void {
    if (!name.trim()) {
      throw new InvalidCategoryNameError()
    }
  }

  get id() {
    return this.props.id
  }

  get organizationId() {
    return this.props.organizationId
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get deletedAt() {
    return this.props.deletedAt
  }

  rename(name: string): void {
    Category.validateName(name)

    const previousName = this.props.name

    this.props.name = name
    this.touch()

    this.addDomainEvent(new CategoryRenamedEvent({ id: this.id, previousName, newName: name }))
  }

  changeDescription(description?: string): void {
    this.props.description = description
    this.touch()
  }

  delete(): void {
    if (!this.props.deletedAt) {
      this.props.deletedAt = new Date()
      this.touch()

      this.addDomainEvent(new CategoryDeletedEvent({ id: this.id, name: this.name }))
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }
}
