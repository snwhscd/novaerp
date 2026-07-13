import { InvalidCategoryNameError } from '@/features/categories/domain/errors/invalid-category-name.error'

export type CategoryId = string

export interface CreateCategoryProps {
  id: CategoryId

  name: string
  description?: string

  createdAt: Date
  updatedAt: Date
}

export interface CategoryProps extends CreateCategoryProps {
  deletedAt?: Date
}

export class Category {
  private constructor(private props: CategoryProps) {}

  static create(props: CreateCategoryProps): Category {
    this.validateName(props.name)

    return new Category({ ...props, deletedAt: undefined })
  }

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

    this.props.name = name
    this.touch()
  }

  changeDescription(description?: string): void {
    this.props.description = description
    this.touch()
  }

  delete(): void {
    if (!this.props.deletedAt) {
      this.props.deletedAt = new Date()
      this.touch()
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }
}
