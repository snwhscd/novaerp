import { AggregateRoot } from '@/shared/domain/aggregate-root'
import { InsufficientStockError } from '@/features/inventory/domain/errors/insufficient-stock.error'
import { InvalidStockQuantityError } from '@/features/inventory/domain/errors/invalid-stock-quantity.error'
import { StockDecreasedEvent } from '@/features/inventory/domain/events/stock-decreased.event'
import { StockIncreasedEvent } from '@/features/inventory/domain/events/stock-increased.event'

export type StockId = string

export interface CreateStockProps {
  id: StockId
  organizationId: string
  productId: string
  initialQuantity: number
  createdAt: Date
  updatedAt: Date
}

export interface StockProps {
  id: StockId
  organizationId: string
  productId: string
  quantity: number
  createdAt: Date
  updatedAt: Date
}

export class Stock extends AggregateRoot {
  private constructor(private props: StockProps) {
    super()
  }

  static create(props: CreateStockProps): Stock {
    if (props.initialQuantity < 0) {
      throw new InvalidStockQuantityError()
    }

    // create() NO emite evento -- "existe un registro de stock" no es en
    // sí mismo un movimiento. El movimiento inicial (si initialQuantity
    // > 0) lo registra el use case como un InventoryMovement explícito
    // con reason INITIAL, no como domain event.
    return new Stock({
      id: props.id,
      organizationId: props.organizationId,
      productId: props.productId,
      quantity: props.initialQuantity,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    })
  }

  static reconstitute(props: StockProps): Stock {
    return new Stock(props)
  }

  get id() {
    return this.props.id
  }

  get organizationId() {
    return this.props.organizationId
  }

  get productId() {
    return this.props.productId
  }

  get quantity() {
    return this.props.quantity
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  increase(amount: number): void {
    if (amount <= 0) {
      throw new InvalidStockQuantityError()
    }

    const previousQuantity = this.props.quantity

    this.props.quantity += amount
    this.touch()

    this.addDomainEvent(
      new StockIncreasedEvent({
        stockId: this.id,
        productId: this.productId,
        previousQuantity,
        newQuantity: this.props.quantity,
      }),
    )
  }

  decrease(amount: number): void {
    if (amount <= 0) {
      throw new InvalidStockQuantityError()
    }

    // El invariante central de este agregado: el stock JAMÁS puede
    // quedar negativo. Esta es la razón de ser de tener Stock como su
    // propia entidad en vez de un simple campo `quantity` en Product.
    if (amount > this.props.quantity) {
      throw new InsufficientStockError(this.productId, this.props.quantity, amount)
    }

    const previousQuantity = this.props.quantity

    this.props.quantity -= amount
    this.touch()

    this.addDomainEvent(
      new StockDecreasedEvent({
        stockId: this.id,
        productId: this.productId,
        previousQuantity,
        newQuantity: this.props.quantity,
      }),
    )
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }
}
