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

  describe('eventos de dominio', () => {
    it('create() emite CategoryCreatedEvent', () => {
      const category = Category.create(buildValidProps())

      const events = category.pullDomainEvents()

      expect(events).toHaveLength(1)
      expect(events[0].eventName).toBe('category.created')
      expect(events[0].entityId).toBe('cat_1')
      expect(events[0].newValues).toEqual({ name: 'Electrónica', description: null })
      expect(events[0].previousValues).toBeNull()
    })

    it('reconstitute() NO emite eventos', () => {
      const category = Category.reconstitute({
        ...buildValidProps(),
        deletedAt: undefined,
      })

      expect(category.pullDomainEvents()).toHaveLength(0)
    })

    it('pullDomainEvents() limpia la lista tras leerla', () => {
      const category = Category.create(buildValidProps())

      category.pullDomainEvents()
      const secondRead = category.pullDomainEvents()

      expect(secondRead).toHaveLength(0)
    })

    it('rename() emite CategoryRenamedEvent con el nombre anterior y el nuevo', () => {
      const category = Category.create(buildValidProps())
      category.pullDomainEvents() // descarta el evento de create()

      category.rename('Cómputo')
      const events = category.pullDomainEvents()

      expect(events).toHaveLength(1)
      expect(events[0].eventName).toBe('category.renamed')
      expect(events[0].previousValues).toEqual({ name: 'Electrónica' })
      expect(events[0].newValues).toEqual({ name: 'Cómputo' })
    })

    it('delete() emite CategoryDeletedEvent solo la primera vez', () => {
      const category = Category.create(buildValidProps())
      category.pullDomainEvents()

      category.delete()
      const firstDeleteEvents = category.pullDomainEvents()

      category.delete() // segunda llamada: no debe emitir nada más
      const secondDeleteEvents = category.pullDomainEvents()

      expect(firstDeleteEvents).toHaveLength(1)
      expect(firstDeleteEvents[0].eventName).toBe('category.deleted')
      expect(secondDeleteEvents).toHaveLength(0)
    })
  })
})
