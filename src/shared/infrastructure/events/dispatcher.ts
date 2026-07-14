import { DomainEventDispatcher } from '@/shared/application/events/domain-event-dispatcher'
import { consoleEventListener } from '@/shared/infrastructure/events/console-event-listener'

export const domainEventDispatcher = new DomainEventDispatcher()

if (process.env.NODE_ENV !== 'production') {
  domainEventDispatcher.subscribe(consoleEventListener)
}
