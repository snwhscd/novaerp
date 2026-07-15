import { Stock } from '@/features/inventory/domain/entities/stock'
import { StockRepository } from '@/features/inventory/domain/repositories/stock.repository'

export class ListStockUseCase {
  constructor(private readonly repository: StockRepository) {}

  async execute(): Promise<Stock[]> {
    return this.repository.findAll()
  }
}
