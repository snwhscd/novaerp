import { DomainEvent } from '@/shared/domain/events/domain-event'

// Cuando construyamos el listener de auditoría real, este puede quedarse
// activo en paralelo (no son excluyentes -- el dispatcher soporta varios
// listeners para el mismo evento) o quitarse, según qué tan ruidoso sea.
export function consoleEventListener(event: DomainEvent): void {
  console.log(`[domain-event] ${event.eventName}`, {
    entityType: event.entityType,
    entityId: event.entityId,
    previousValues: event.previousValues,
    newValues: event.newValues,
    occurredAt: event.occurredAt.toISOString(),
  })
}
