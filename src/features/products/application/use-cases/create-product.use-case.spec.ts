import { beforeEach, describe, expect, it } from 'vitest'

import { ProductType } from '@/features/products/domain/enums/product-type'
import { DuplicateSkuError } from '@/features/products/domain/errors/duplicate-sku.error'
import { Product, ProductId } from '@/features/products/domain/entities/product'
import {
  ProductRepository,
  ProductSearchCriteria,
  ProductSearchResult,
} from '@/features/products/domain/repositories/product.repository'
import { CreateProductUseCase } from '@/features/products/application/use-cases/create-product.use-case'

class InMemoryProductRepository implements ProductRepository {
  private products = new Map<string, Product>()

  async save(product: Product): Promise<void> {
    this.products.set(product.id, product)
  }

  async update(product: Product): Promise<void> {
    this.products.set(product.id, product)
  }

  async delete(id: ProductId): Promise<void> {
    this.products.get(id)?.delete()
  }

  async findById(id: ProductId): Promise<Product | null> {
    return this.products.get(id) ?? null
  }

  async findBySku(sku: string): Promise<Product | null> {
    return [...this.products.values()].find((p) => p.sku === sku) ?? null
  }

  async findMany(_criteria: ProductSearchCriteria): Promise<ProductSearchResult> {
    const items = [...this.products.values()]
    return { items, total: items.length, page: 1, limit: items.length }
  }

  async findAll(): Promise<Product[]> {
    return [...this.products.values()]
  }
}

class FakeIdGenerator {
  private counter = 0

  generateId(): string {
    this.counter += 1
    return `id_${this.counter}`
  }
}

class FakeSkuGenerator {
  async generateSku(): Promise<string> {
    return 'AUTO-SKU'
  }
}

const TEST_ORGANIZATION_ID = 'org_test'

describe('CreateProductUseCase', () => {
  let repository: InMemoryProductRepository
  let useCase: CreateProductUseCase

  beforeEach(() => {
    repository = new InMemoryProductRepository()
    useCase = new CreateProductUseCase(
      repository,
      new FakeIdGenerator(),
      new FakeSkuGenerator(),
      TEST_ORGANIZATION_ID,
    )
  })

  it('crea un producto con SKU provisto', async () => {
    const result = await useCase.execute({
      sku: 'SKU-100',
      name: 'Silla',
      productType: ProductType.PHYSICAL,
      costPrice: 50,
      salePrice: 100,
      categoryId: 'cat_1',
    })

    const saved = await repository.findById(result.id)

    expect(saved).not.toBeNull()
    expect(saved?.sku).toBe('SKU-100')
  })

  it('asigna la organización inyectada al producto creado', async () => {
    const result = await useCase.execute({
      sku: 'SKU-200',
      name: 'Escritorio',
      productType: ProductType.PHYSICAL,
      costPrice: 80,
      salePrice: 150,
      categoryId: 'cat_1',
    })

    const saved = await repository.findById(result.id)

    expect(saved?.organizationId).toBe(TEST_ORGANIZATION_ID)
  })

  it('genera un SKU automáticamente si no se provee', async () => {
    const result = await useCase.execute({
      name: 'Mesa',
      productType: ProductType.PHYSICAL,
      costPrice: 30,
      salePrice: 60,
      categoryId: 'cat_1',
    })

    const saved = await repository.findById(result.id)

    expect(saved?.sku).toBe('AUTO-SKU')
  })

  it('lanza DuplicateSkuError si el SKU ya existe', async () => {
    await useCase.execute({
      sku: 'SKU-DUP',
      name: 'Silla',
      productType: ProductType.PHYSICAL,
      costPrice: 50,
      salePrice: 100,
      categoryId: 'cat_1',
    })

    await expect(
      useCase.execute({
        sku: 'SKU-DUP',
        name: 'Otra silla',
        productType: ProductType.PHYSICAL,
        costPrice: 40,
        salePrice: 90,
        categoryId: 'cat_1',
      }),
    ).rejects.toThrow(DuplicateSkuError)
  })

  it('activa trackInventory por defecto', async () => {
    const result = await useCase.execute({
      name: 'Servicio de instalación',
      productType: ProductType.SERVICE,
      costPrice: 0,
      salePrice: 200,
      categoryId: 'cat_1',
    })

    const saved = await repository.findById(result.id)

    expect(saved?.trackInventory).toBe(true)
  })
})
