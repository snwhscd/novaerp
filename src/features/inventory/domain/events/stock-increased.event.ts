import { DomainEvent } from '@/shared/domain/events/domain-event'

export interface StockIncreasedEventPayload {
  stockId: string
  productId: string
  previousQuantity: number
  newQuantity: number
}

export class StockIncreasedEvent extends DomainEvent {
  readonly eventName = 'stock.increased'
  readonly module = 'inventory'
  readonly entityType = 'Stock'
  readonly entityId: string
  readonly previousValues: Record<string, unknown>
  readonly newValues: Record<string, unknown>

  constructor(payload: StockIncreasedEventPayload) {
    super()
    this.entityId = payload.stockId
    this.previousValues = { productId: payload.productId, quantity: payload.previousQuantity }
    this.newValues = { productId: payload.productId, quantity: payload.newQuantity }
  }
}
