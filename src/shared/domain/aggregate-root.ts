import { DomainEvent } from '@/shared/domain/events/domain-event'

export abstract class AggregateRoot {
  private domainEvents: DomainEvent[] = []

  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event)
  }

  // El use case llama esto DESPUÉS de guardar la entidad -- "jala" los
  // eventos acumulados y limpia la lista. Si nadie los jala, se quedan
  // sin despachar (por diseño: guardar en BD y emitir eventos son dos
  // pasos separados, nunca automáticos entre sí).
  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents]
    this.domainEvents = []
    return events
  }
}
