import { describe, expect, it } from 'vitest'

import { Brand } from '@/features/brands/domain/entities/brand'
import { InvalidBrandNameError } from '@/features/brands/domain/errors/invalid-brand-name.error'

function buildValidProps(overrides: Partial<Parameters<typeof Brand.create>[0]> = {}) {
  return {
    id: 'brand_1',
    organizationId: 'org_1',
    name: 'Samsung',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

describe('Brand', () => {
  it('crea una marca válida', () => {
    const brand = Brand.create(buildValidProps())

    expect(brand.id).toBe('brand_1')
    expect(brand.name).toBe('Samsung')
  })

  it('expone la organización a la que pertenece', () => {
    const brand = Brand.create(buildValidProps({ organizationId: 'org_42' }))

    expect(brand.organizationId).toBe('org_42')
  })

  it('rechaza nombre vacío', () => {
    expect(() => Brand.create(buildValidProps({ name: '   ' }))).toThrow(InvalidBrandNameError)
  })

  it('renombra y actualiza updatedAt', async () => {
    const brand = Brand.create(buildValidProps())
    const originalUpdatedAt = brand.updatedAt

    await new Promise((resolve) => setTimeout(resolve, 5))
    brand.rename('LG')

    expect(brand.name).toBe('LG')
    expect(brand.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
  })

  it('no permite renombrar con nombre vacío', () => {
    const brand = Brand.create(buildValidProps())

    expect(() => brand.rename('')).toThrow(InvalidBrandNameError)
  })

  it('marca como eliminado sin lanzar error en doble delete', () => {
    const brand = Brand.create(buildValidProps())

    brand.delete()
    const firstDeletedAt = brand.deletedAt

    brand.delete()

    expect(brand.deletedAt).toBe(firstDeletedAt)
  })
})
