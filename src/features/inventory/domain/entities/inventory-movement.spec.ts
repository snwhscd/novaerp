import { describe, expect, it } from 'vitest'

import { InventoryMovement } from '@/features/inventory/domain/entities/inventory-movement'
import { InventoryMovementReason } from '@/features/inventory/domain/enums/inventory-movement-reason'
import { InvalidStockQuantityError } from '@/features/inventory/domain/errors/invalid-stock-quantity.error'

function buildValidProps(overrides: Partial<Parameters<typeof InventoryMovement.create>[0]> = {}) {
  return {
    id: 'mov_1',
    organizationId: 'org_1',
    productId: 'prod_1',
    quantityDelta: 10,
    reason: InventoryMovementReason.MANUAL_ADJUSTMENT,
    createdAt: new Date(),
    ...overrides,
  }
}

describe('InventoryMovement', () => {
  it('crea un movimiento de entrada (delta positivo)', () => {
    const movement = InventoryMovement.create(buildValidProps({ quantityDelta: 15 }))

    expect(movement.quantityDelta).toBe(15)
  })

  it('crea un movimiento de salida (delta negativo)', () => {
    const movement = InventoryMovement.create(buildValidProps({ quantityDelta: -7 }))

    expect(movement.quantityDelta).toBe(-7)
  })

  it('rechaza delta en cero -- no existe un "movimiento de nada"', () => {
    expect(() => InventoryMovement.create(buildValidProps({ quantityDelta: 0 }))).toThrow(
      InvalidStockQuantityError,
    )
  })

  it('expone la nota opcional', () => {
    const movement = InventoryMovement.create(buildValidProps({ note: 'Conteo físico' }))

    expect(movement.note).toBe('Conteo físico')
  })
})
