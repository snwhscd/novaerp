import { SkuGenerator } from '@/features/products/domain/services/sku-generator'
import { ulid } from 'ulid'

export class DefaultSkuGenerator implements SkuGenerator {
  async generateSku(): Promise<string> {
    return `PRD-${ulid()}`
  }
}
