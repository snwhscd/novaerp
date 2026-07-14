import { DomainEvent } from '@/shared/domain/events/domain-event'

export interface CategoryDeletedEventPayload {
  id: string
  name: string
}

export class CategoryDeletedEvent extends DomainEvent {
  readonly eventName = 'category.deleted'
  readonly module = 'categories'
  readonly entityType = 'Category'
  readonly entityId: string
  readonly previousValues: Record<string, unknown>
  readonly newValues = null

  constructor(payload: CategoryDeletedEventPayload) {
    super()
    this.entityId = payload.id
    this.previousValues = { name: payload.name }
  }
}
