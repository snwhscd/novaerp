import { Stock, StockId } from '@/features/inventory/domain/entities/stock'

export interface StockRepository {
  save(stock: Stock): Promise<void>

  update(stock: Stock): Promise<void>

  findById(id: StockId): Promise<Stock | null>

  findByProductId(productId: string): Promise<Stock | null>

  findAll(): Promise<Stock[]>
}
