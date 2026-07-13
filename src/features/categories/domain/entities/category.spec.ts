import { describe, expect, it } from 'vitest'

import { Category } from '@/features/categories/domain/entities/category'
import { InvalidCategoryNameError } from '@/features/categories/domain/errors/invalid-category-name.error'

function buildValidProps(overrides: Partial<Parameters<typeof Category.create>[0]> = {}) {
  return {
    id: 'cat_1',
    name: 'Electrónica',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

describe('Category', () => {
  it('crea una categoría válida', () => {
    const category = Category.create(buildValidProps())

    expect(category.id).toBe('cat_1')
    expect(category.name).toBe('Electrónica')
  })

  it('rechaza nombre vacío', () => {
    expect(() => Category.create(buildValidProps({ name: '   ' }))).toThrow(
      InvalidCategoryNameError,
    )
  })

  it('renombra y actualiza updatedAt', async () => {
    const category = Category.create(buildValidProps())
    const originalUpdatedAt = category.updatedAt

    await new Promise((resolve) => setTimeout(resolve, 5))
    category.rename('Cómputo')

    expect(category.name).toBe('Cómputo')
    expect(category.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
  })

  it('marca como eliminado sin lanzar error en doble delete', () => {
    const category = Category.create(buildValidProps())

    category.delete()
    const firstDeletedAt = category.deletedAt

    category.delete()

    expect(category.deletedAt).toBe(firstDeletedAt)
  })
})
