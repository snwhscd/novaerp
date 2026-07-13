import { InvalidBrandNameError } from '@/features/brands/domain/errors/invalid-brand-name.error'

export type BrandId = string

export interface CreateBrandProps {
  id: BrandId
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface BrandProps extends CreateBrandProps {
  deletedAt?: Date
}

export class Brand {
  private constructor(private props: BrandProps) {}

  static create(props: CreateBrandProps): Brand {
    this.validateName(props.name)
    return new Brand({ ...props, deletedAt: undefined })
  }

  static reconstitute(props: BrandProps): Brand {
    return new Brand(props)
  }

  private static validateName(name: string): void {
    if (!name.trim()) throw new InvalidBrandNameError()
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
    Brand.validateName(name)
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
    }
    this.touch()
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }
}
