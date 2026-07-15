import { DomainEvent } from '@/shared/domain/events/domain-event'

export interface StockDecreasedEventPayload {
  stockId: string
  productId: string
  previousQuantity: number
  newQuantity: number
}

export class StockDecreasedEvent extends DomainEvent {
  readonly eventName = 'stock.decreased'
  readonly module = 'inventory'
  readonly entityType = 'Stock'
  readonly entityId: string
  readonly previousValues: Record<string, unknown>
  readonly newValues: Record<string, unknown>

  constructor(payload: StockDecreasedEventPayload) {
    super()
    this.entityId = payload.stockId
    this.previousValues = { productId: payload.productId, quantity: payload.previousQuantity }
    this.newValues = { productId: payload.productId, quantity: payload.newQuantity }
  }
}
