import { DomainEvent } from '@/shared/domain/events/domain-event'

export interface CategoryCreatedEventPayload {
  id: string
  name: string
  description?: string
}

export class CategoryCreatedEvent extends DomainEvent {
  readonly eventName = 'category.created'
  readonly module = 'categories'
  readonly entityType = 'Category'
  readonly entityId: string
  readonly previousValues = null
  readonly newValues: Record<string, unknown>

  constructor(payload: CategoryCreatedEventPayload) {
    super()
    this.entityId = payload.id
    this.newValues = { name: payload.name, description: payload.description ?? null }
  }
}
