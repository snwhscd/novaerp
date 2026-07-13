import { describe, expect, it } from 'vitest'

import { ProductType } from '@/features/products/domain/enums/product-type'
import { InvalidCategoryError } from '@/features/products/domain/errors/invalid-category.error'
import { InvalidProductNameError } from '@/features/products/domain/errors/invalid-product-name.error'
import { InvalidProductPriceError } from '@/features/products/domain/errors/invalid-product-price.error'
import { InvalidSkuError } from '@/features/products/domain/errors/invalid-sku.error'
import { Product } from '@/features/products/domain/entities/product'

function buildValidProps(overrides: Partial<Parameters<typeof Product.create>[0]> = {}) {
  return {
    id: 'prod_1',
    sku: 'SKU-001',
    name: 'Producto de prueba',
    productType: ProductType.PHYSICAL,
    costPrice: 10,
    salePrice: 20,
    trackInventory: true,
    categoryId: 'cat_1',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

describe('Product', () => {
  it('crea un producto válido', () => {
    const product = Product.create(buildValidProps())

    expect(product.id).toBe('prod_1')
    expect(product.name).toBe('Producto de prueba')
    expect(product.deletedAt).toBeUndefined()
  })

  it('rechaza nombre vacío', () => {
    expect(() => Product.create(buildValidProps({ name: '   ' }))).toThrow(InvalidProductNameError)
  })

  it('rechaza SKU vacío', () => {
    expect(() => Product.create(buildValidProps({ sku: '' }))).toThrow(InvalidSkuError)
  })

  it('rechaza categoría vacía', () => {
    expect(() => Product.create(buildValidProps({ categoryId: '' }))).toThrow(InvalidCategoryError)
  })

  it('rechaza precio de costo negativo', () => {
    expect(() => Product.create(buildValidProps({ costPrice: -1 }))).toThrow(
      InvalidProductPriceError,
    )
  })

  it('rechaza precio de venta negativo', () => {
    expect(() => Product.create(buildValidProps({ salePrice: -1 }))).toThrow(
      InvalidProductPriceError,
    )
  })

  it('renombra y actualiza updatedAt', async () => {
    const product = Product.create(buildValidProps())
    const originalUpdatedAt = product.updatedAt

    await new Promise((resolve) => setTimeout(resolve, 5))
    product.rename('Nuevo nombre')

    expect(product.name).toBe('Nuevo nombre')
    expect(product.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
  })

  it('no permite renombrar con nombre vacío', () => {
    const product = Product.create(buildValidProps())

    expect(() => product.rename('')).toThrow(InvalidProductNameError)
  })

  it('cambia el precio de venta validando contra el costo actual', () => {
    const product = Product.create(buildValidProps({ costPrice: 10, salePrice: 20 }))

    product.changeSalePrice(15)

    expect(product.salePrice).toBe(15)
  })

  it('marca como eliminado sin lanzar error en doble delete', () => {
    const product = Product.create(buildValidProps())

    product.delete()
    const firstDeletedAt = product.deletedAt

    product.delete()

    expect(product.deletedAt).toBe(firstDeletedAt)
  })

  it('reconstituye un producto existente sin re-validar', () => {
    const product = Product.reconstitute({
      ...buildValidProps(),
      deletedAt: undefined,
    })

    expect(product.id).toBe('prod_1')
  })
})
