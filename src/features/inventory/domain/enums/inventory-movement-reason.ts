export const InventoryMovementReason = {
  INITIAL: 'INITIAL',
  MANUAL_ADJUSTMENT: 'MANUAL_ADJUSTMENT',
  SALE: 'SALE',
  PURCHASE: 'PURCHASE',
  RETURN: 'RETURN',
} as const

export type InventoryMovementReason =
  (typeof InventoryMovementReason)[keyof typeof InventoryMovementReason]
