import { describe, expect, it } from 'vitest'

import { Stock } from '@/features/inventory/domain/entities/stock'
import { InsufficientStockError } from '@/features/inventory/domain/errors/insufficient-stock.error'
import { InvalidStockQuantityError } from '@/features/inventory/domain/errors/invalid-stock-quantity.error'

function buildValidProps(overrides: Partial<Parameters<typeof Stock.create>[0]> = {}) {
  return {
    id: 'stock_1',
    organizationId: 'org_1',
    productId: 'prod_1',
    initialQuantity: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

describe('Stock', () => {
  it('crea un stock con la cantidad inicial dada', () => {
    const stock = Stock.create(buildValidProps({ initialQuantity: 25 }))

    expect(stock.quantity).toBe(25)
  })

  it('permite cantidad inicial en cero', () => {
    const stock = Stock.create(buildValidProps({ initialQuantity: 0 }))

    expect(stock.quantity).toBe(0)
  })

  it('rechaza cantidad inicial negativa', () => {
    expect(() => Stock.create(buildValidProps({ initialQuantity: -1 }))).toThrow(
      InvalidStockQuantityError,
    )
  })

  it('create() no emite eventos', () => {
    const stock = Stock.create(buildValidProps())

    expect(stock.pullDomainEvents()).toHaveLength(0)
  })

  describe('increase()', () => {
    it('aumenta la cantidad', () => {
      const stock = Stock.create(buildValidProps({ initialQuantity: 10 }))

      stock.increase(5)

      expect(stock.quantity).toBe(15)
    })

    it('rechaza cantidades cero o negativas', () => {
      const stock = Stock.create(buildValidProps())

      expect(() => stock.increase(0)).toThrow(InvalidStockQuantityError)
      expect(() => stock.increase(-5)).toThrow(InvalidStockQuantityError)
    })

    it('emite StockIncreasedEvent con el before/after correcto', () => {
      const stock = Stock.create(buildValidProps({ initialQuantity: 10 }))

      stock.increase(5)
      const events = stock.pullDomainEvents()

      expect(events).toHaveLength(1)
      expect(events[0].eventName).toBe('stock.increased')
      expect(events[0].previousValues).toMatchObject({ quantity: 10 })
      expect(events[0].newValues).toMatchObject({ quantity: 15 })
    })
  })

  describe('decrease()', () => {
    it('disminuye la cantidad', () => {
      const stock = Stock.create(buildValidProps({ initialQuantity: 10 }))

      stock.decrease(4)

      expect(stock.quantity).toBe(6)
    })

    it('permite dejar la cantidad exactamente en cero', () => {
      const stock = Stock.create(buildValidProps({ initialQuantity: 10 }))

      stock.decrease(10)

      expect(stock.quantity).toBe(0)
    })

    it('NUNCA permite que la cantidad quede negativa', () => {
      const stock = Stock.create(buildValidProps({ initialQuantity: 5 }))

      expect(() => stock.decrease(6)).toThrow(InsufficientStockError)
      // Y el intento fallido no debe haber mutado el estado.
      expect(stock.quantity).toBe(5)
    })

    it('rechaza cantidades cero o negativas', () => {
      const stock = Stock.create(buildValidProps({ initialQuantity: 10 }))

      expect(() => stock.decrease(0)).toThrow(InvalidStockQuantityError)
      expect(() => stock.decrease(-3)).toThrow(InvalidStockQuantityError)
    })

    it('emite StockDecreasedEvent con el before/after correcto', () => {
      const stock = Stock.create(buildValidProps({ initialQuantity: 10 }))

      stock.decrease(4)
      const events = stock.pullDomainEvents()

      expect(events).toHaveLength(1)
      expect(events[0].eventName).toBe('stock.decreased')
      expect(events[0].previousValues).toMatchObject({ quantity: 10 })
      expect(events[0].newValues).toMatchObject({ quantity: 6 })
    })

    it('no emite ningún evento si la operación falla por stock insuficiente', () => {
      const stock = Stock.create(buildValidProps({ initialQuantity: 5 }))

      expect(() => stock.decrease(10)).toThrow(InsufficientStockError)
      expect(stock.pullDomainEvents()).toHaveLength(0)
    })
  })
})
