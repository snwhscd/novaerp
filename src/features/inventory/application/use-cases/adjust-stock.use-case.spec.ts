import { beforeEach, describe, expect, it } from 'vitest'

import { InventoryMovement } from '@/features/inventory/domain/entities/inventory-movement'
import { Stock, StockId } from '@/features/inventory/domain/entities/stock'
import { InsufficientStockError } from '@/features/inventory/domain/errors/insufficient-stock.error'
import { InventoryMovementReason } from '@/features/inventory/domain/enums/inventory-movement-reason'
import { InventoryMovementRepository } from '@/features/inventory/domain/repositories/inventory-movement.repository'
import { StockRepository } from '@/features/inventory/domain/repositories/stock.repository'
import { AdjustStockUseCase } from '@/features/inventory/application/use-cases/adjust-stock.use-case'
import { DomainEventDispatcher } from '@/shared/application/events/domain-event-dispatcher'

class InMemoryStockRepository implements StockRepository {
  private stocks = new Map<string, Stock>()

  async save(stock: Stock): Promise<void> {
    this.stocks.set(stock.id, stock)
  }

  async update(stock: Stock): Promise<void> {
    this.stocks.set(stock.id, stock)
  }

  async findById(id: StockId): Promise<Stock | null> {
    return this.stocks.get(id) ?? null
  }

  async findByProductId(productId: string): Promise<Stock | null> {
    return [...this.stocks.values()].find((s) => s.productId === productId) ?? null
  }

  async findAll(): Promise<Stock[]> {
    return [...this.stocks.values()]
  }
}

class InMemoryInventoryMovementRepository implements InventoryMovementRepository {
  movements: InventoryMovement[] = []

  async save(movement: InventoryMovement): Promise<void> {
    this.movements.push(movement)
  }

  async findByProductId(productId: string): Promise<InventoryMovement[]> {
    return this.movements.filter((m) => m.productId === productId)
  }
}

class FakeIdGenerator {
  private counter = 0

  generateId(): string {
    this.counter += 1
    return `id_${this.counter}`
  }
}

const TEST_ORGANIZATION_ID = 'org_test'

describe('AdjustStockUseCase', () => {
  let stockRepository: InMemoryStockRepository
  let movementRepository: InMemoryInventoryMovementRepository
  let useCase: AdjustStockUseCase

  beforeEach(() => {
    stockRepository = new InMemoryStockRepository()
    movementRepository = new InMemoryInventoryMovementRepository()
    useCase = new AdjustStockUseCase(
      stockRepository,
      movementRepository,
      new FakeIdGenerator(),
      new DomainEventDispatcher(),
      TEST_ORGANIZATION_ID,
    )
  })

  it('crea el Stock automáticamente si el producto nunca tuvo uno (empieza en 0)', async () => {
    const result = await useCase.execute({
      productId: 'prod_1',
      quantityDelta: 20,
      reason: InventoryMovementReason.MANUAL_ADJUSTMENT,
    })

    expect(result.newQuantity).toBe(20)

    const stock = await stockRepository.findByProductId('prod_1')
    expect(stock?.quantity).toBe(20)
  })

  it('reutiliza el Stock existente en llamadas subsecuentes', async () => {
    await useCase.execute({
      productId: 'prod_1',
      quantityDelta: 20,
      reason: InventoryMovementReason.MANUAL_ADJUSTMENT,
    })

    const result = await useCase.execute({
      productId: 'prod_1',
      quantityDelta: 5,
      reason: InventoryMovementReason.MANUAL_ADJUSTMENT,
    })

    expect(result.newQuantity).toBe(25)
    expect(await stockRepository.findAll()).toHaveLength(1)
  })

  it('delta negativo descuenta stock', async () => {
    await useCase.execute({
      productId: 'prod_1',
      quantityDelta: 20,
      reason: InventoryMovementReason.MANUAL_ADJUSTMENT,
    })

    const result = await useCase.execute({
      productId: 'prod_1',
      quantityDelta: -8,
      reason: InventoryMovementReason.MANUAL_ADJUSTMENT,
    })

    expect(result.newQuantity).toBe(12)
  })

  it('propaga InsufficientStockError si el descuento excede lo disponible', async () => {
    await useCase.execute({
      productId: 'prod_1',
      quantityDelta: 5,
      reason: InventoryMovementReason.MANUAL_ADJUSTMENT,
    })

    await expect(
      useCase.execute({
        productId: 'prod_1',
        quantityDelta: -10,
        reason: InventoryMovementReason.MANUAL_ADJUSTMENT,
      }),
    ).rejects.toThrow(InsufficientStockError)
  })

  it('registra un InventoryMovement por cada ajuste, con su nota', async () => {
    await useCase.execute({
      productId: 'prod_1',
      quantityDelta: 30,
      reason: InventoryMovementReason.MANUAL_ADJUSTMENT,
      note: 'Recepción inicial',
    })

    await useCase.execute({
      productId: 'prod_1',
      quantityDelta: -3,
      reason: InventoryMovementReason.MANUAL_ADJUSTMENT,
      note: 'Producto dañado',
    })

    expect(movementRepository.movements).toHaveLength(2)
    expect(movementRepository.movements[0].quantityDelta).toBe(30)
    expect(movementRepository.movements[0].note).toBe('Recepción inicial')
    expect(movementRepository.movements[1].quantityDelta).toBe(-3)
    expect(movementRepository.movements[1].note).toBe('Producto dañado')
  })

  it('despacha el evento correcto al dispatcher inyectado', async () => {
    const dispatcher = new DomainEventDispatcher()
    const received: string[] = []
    dispatcher.subscribe((event) => {
      received.push(event.eventName)
    })

    const useCaseWithSpy = new AdjustStockUseCase(
      stockRepository,
      movementRepository,
      new FakeIdGenerator(),
      dispatcher,
      TEST_ORGANIZATION_ID,
    )

    await useCaseWithSpy.execute({
      productId: 'prod_1',
      quantityDelta: 10,
      reason: InventoryMovementReason.MANUAL_ADJUSTMENT,
    })
    await useCaseWithSpy.execute({
      productId: 'prod_1',
      quantityDelta: -4,
      reason: InventoryMovementReason.MANUAL_ADJUSTMENT,
    })

    expect(received).toEqual(['stock.increased', 'stock.decreased'])
  })

  it('asigna la organización inyectada al stock creado', async () => {
    await useCase.execute({
      productId: 'prod_1',
      quantityDelta: 10,
      reason: InventoryMovementReason.MANUAL_ADJUSTMENT,
    })

    const stock = await stockRepository.findByProductId('prod_1')
    expect(stock?.organizationId).toBe(TEST_ORGANIZATION_ID)
  })
})
