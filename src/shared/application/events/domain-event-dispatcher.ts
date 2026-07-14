import { DomainEvent } from '@/shared/domain/events/domain-event'

export type DomainEventListener = (event: DomainEvent) => Promise<void> | void

export class DomainEventDispatcher {
  private listeners: DomainEventListener[] = []

  subscribe(listener: DomainEventListener): void {
    this.listeners.push(listener)
  }

  async dispatch(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      for (const listener of this.listeners) {
        await listener(event)
      }
    }
  }
}
