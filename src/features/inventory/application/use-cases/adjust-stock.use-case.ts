import { InventoryMovement } from '@/features/inventory/domain/entities/inventory-movement'
import { Stock } from '@/features/inventory/domain/entities/stock'
import { InvalidStockQuantityError } from '@/features/inventory/domain/errors/invalid-stock-quantity.error'
import { InventoryMovementRepository } from '@/features/inventory/domain/repositories/inventory-movement.repository'
import { StockRepository } from '@/features/inventory/domain/repositories/stock.repository'
import { AdjustStockDto } from '@/features/inventory/application/dtos/adjust-stock.dto'
import { DomainEventDispatcher } from '@/shared/application/events/domain-event-dispatcher'
import { IdGenerator } from '@/shared/ids/id-generator'

export interface AdjustStockResult {
  stockId: string
  newQuantity: number
}

export class AdjustStockUseCase {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly movementRepository: InventoryMovementRepository,
    private readonly idGenerator: IdGenerator,
    private readonly eventDispatcher: DomainEventDispatcher,
    private readonly organizationId: string,
  ) {}

  async execute(dto: AdjustStockDto): Promise<AdjustStockResult> {
    if (dto.quantityDelta === 0) {
      throw new InvalidStockQuantityError()
    }

    const now = new Date()

    let stock = await this.stockRepository.findByProductId(dto.productId)
    const isNewStock = !stock

    if (!stock) {
      stock = Stock.create({
        id: this.idGenerator.generateId(),
        organizationId: this.organizationId,
        productId: dto.productId,
        initialQuantity: 0,
        createdAt: now,
        updatedAt: now,
      })
    }

    // El invariante de "nunca negativo" vive en la entidad (Stock.decrease),
    // no aquí -- este use case solo decide si toca increase() o decrease()
    // según el signo, y deja que la entidad reviente si no aplica.
    if (dto.quantityDelta > 0) {
      stock.increase(dto.quantityDelta)
    } else {
      stock.decrease(Math.abs(dto.quantityDelta))
    }

    if (isNewStock) {
      await this.stockRepository.save(stock)
    } else {
      await this.stockRepository.update(stock)
    }

    // El movimiento se guarda SIEMPRE, incluso si la entidad no emitiera
    // eventos -- es el dato de negocio (kardex), independiente del
    // mecanismo técnico de auditoría.
    const movement = InventoryMovement.create({
      id: this.idGenerator.generateId(),
      organizationId: this.organizationId,
      productId: dto.productId,
      quantityDelta: dto.quantityDelta,
      reason: dto.reason,
      note: dto.note,
      createdAt: now,
    })

    await this.movementRepository.save(movement)

    await this.eventDispatcher.dispatch(stock.pullDomainEvents())

    return { stockId: stock.id, newQuantity: stock.quantity }
  }
}
