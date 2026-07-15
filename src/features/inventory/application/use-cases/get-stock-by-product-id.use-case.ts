import { Stock } from '@/features/inventory/domain/entities/stock'
import { StockRepository } from '@/features/inventory/domain/repositories/stock.repository'

export class GetStockByProductIdUseCase {
  constructor(private readonly repository: StockRepository) {}

  async execute(productId: string): Promise<Stock | null> {
    return this.repository.findByProductId(productId)
  }
}
