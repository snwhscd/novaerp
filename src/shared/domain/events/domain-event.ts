// Todo evento de dominio expone estos mismos 6 campos -- no es casualidad:
// son exactamente lo que necesita el futuro listener de auditoría genérico
// (módulo, entidad, id de entidad, valores antes/después). Diseñar el
// contrato así significa que el listener de auditoría no necesita un
// switch/case por cada tipo de evento; solo lee estos campos.
export abstract class DomainEvent {
  readonly occurredAt: Date = new Date()

  abstract readonly eventName: string
  abstract readonly module: string
  abstract readonly entityType: string
  abstract readonly entityId: string
  abstract readonly previousValues: Record<string, unknown> | null
  abstract readonly newValues: Record<string, unknown> | null
}
