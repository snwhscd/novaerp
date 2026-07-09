import { CreateProductDto } from '@/features/products/application/dtos/create-product.dto'
import { Product } from '@/features/products/domain/entities/product'
import { DuplicateSkuError } from '@/features/products/domain/errors/duplicate-sku.error'
import { ProductRepository } from '@/features/products/domain/repositories/product.repository'
import { SkuGenerator } from '@/features/products/domain/services/sku-generator'
import { IdGenerator } from '@/shared/ids/id-generator'

export class CreateProductUseCase {
  constructor(
    private readonly repository: ProductRepository,
    private readonly idGenerator: IdGenerator,
    private readonly skuGenerator: SkuGenerator,
  ) {}

  async execute(dto: CreateProductDto): Promise<{ id: string }> {
    const sku = dto.sku ?? (await this.skuGenerator.generateSku())

    const existingProduct = await this.repository.findBySku(sku)

    if (existingProduct) {
      throw new DuplicateSkuError(sku)
    }

    // TODO: reemplazar por Clock cuando exista un servicio compartido.
    const now = new Date()

    const product = Product.create({
      id: this.idGenerator.generateId(),

      sku,
      barcode: dto.barcode,

      name: dto.name,
      description: dto.description,

      productType: dto.productType,

      costPrice: dto.costPrice,
      salePrice: dto.salePrice,

      trackInventory: dto.trackInventory ?? true,

      brandId: dto.brandId,
      categoryId: dto.categoryId,

      createdAt: now,
      updatedAt: now,
    })

    await this.repository.save(product)

    return {
      id: product.id,
    }
  }
}
