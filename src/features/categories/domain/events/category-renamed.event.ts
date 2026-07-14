import { DomainEvent } from '@/shared/domain/events/domain-event'

export interface CategoryRenamedEventPayload {
  id: string
  previousName: string
  newName: string
}

export class CategoryRenamedEvent extends DomainEvent {
  readonly eventName = 'category.renamed'
  readonly module = 'categories'
  readonly entityType = 'Category'
  readonly entityId: string
  readonly previousValues: Record<string, unknown>
  readonly newValues: Record<string, unknown>

  constructor(payload: CategoryRenamedEventPayload) {
    super()
    this.entityId = payload.id
    this.previousValues = { name: payload.previousName }
    this.newValues = { name: payload.newName }
  }
}
