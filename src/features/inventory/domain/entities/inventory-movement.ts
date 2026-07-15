import { InventoryMovementReason } from '@/features/inventory/domain/enums/inventory-movement-reason'
import { InvalidStockQuantityError } from '@/features/inventory/domain/errors/invalid-stock-quantity.error'

export type InventoryMovementId = string

export interface CreateInventoryMovementProps {
  id: InventoryMovementId
  organizationId: string
  productId: string
  quantityDelta: number
  reason: InventoryMovementReason
  note?: string
  createdAt: Date
}

// A propósito NO tiene métodos de mutación (nada de rename/delete como
// las demás entidades) -- un movimiento de inventario ya ocurrido no se
// edita ni se borra, es un hecho histórico. Si te equivocaste, se
// registra OTRO movimiento que lo corrija, nunca se toca el original.
export class InventoryMovement {
  private constructor(private props: CreateInventoryMovementProps) {}

  static create(props: CreateInventoryMovementProps): InventoryMovement {
    if (props.quantityDelta === 0) {
      throw new InvalidStockQuantityError()
    }

    return new InventoryMovement(props)
  }

  static reconstitute(props: CreateInventoryMovementProps): InventoryMovement {
    return new InventoryMovement(props)
  }

  get id() {
    return this.props.id
  }

  get organizationId() {
    return this.props.organizationId
  }

  get productId() {
    return this.props.productId
  }

  get quantityDelta() {
    return this.props.quantityDelta
  }

  get reason() {
    return this.props.reason
  }

  get note() {
    return this.props.note
  }

  get createdAt() {
    return this.props.createdAt
  }
}
