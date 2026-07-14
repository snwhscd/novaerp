import { beforeEach, describe, expect, it } from 'vitest'

import { Category, CategoryId } from '@/features/categories/domain/entities/category'
import { DuplicateCategoryNameError } from '@/features/categories/domain/errors/duplicate-category-name.error'
import { CategoryRepository } from '@/features/categories/domain/repositories/category.repository'
import { FindOrCreateCategoryByNameUseCase } from '@/features/categories/application/use-cases/find-or-create-category-by-name.use-case'
import { DomainEventDispatcher } from '@/shared/application/events/domain-event-dispatcher'

class InMemoryCategoryRepository implements CategoryRepository {
  private categories = new Map<string, Category>()

  async save(category: Category): Promise<void> {
    this.categories.set(category.id, category)
  }

  async update(category: Category): Promise<void> {
    this.categories.set(category.id, category)
  }

  async delete(id: CategoryId): Promise<void> {
    this.categories.get(id)?.delete()
  }

  async findById(id: CategoryId): Promise<Category | null> {
    return this.categories.get(id) ?? null
  }

  async findByName(name: string): Promise<Category | null> {
    return [...this.categories.values()].find((c) => c.name === name) ?? null
  }

  async findAll(): Promise<Category[]> {
    return [...this.categories.values()]
  }
}

class FakeIdGenerator {
  private counter = 0

  generateId(): string {
    this.counter += 1
    return `id_${this.counter}`
  }
}

describe('FindOrCreateCategoryByNameUseCase', () => {
  let repository: InMemoryCategoryRepository
  let useCase: FindOrCreateCategoryByNameUseCase

  beforeEach(() => {
    repository = new InMemoryCategoryRepository()
    useCase = new FindOrCreateCategoryByNameUseCase(
      repository,
      new FakeIdGenerator(),
      new DomainEventDispatcher(),
    )
  })

  it('crea una categoría nueva si no existe', async () => {
    const result = await useCase.execute({ name: 'Electrónica' })

    const saved = await repository.findByName('Electrónica')

    expect(saved).not.toBeNull()
    expect(saved?.id).toBe(result.id)
  })

  it('reutiliza la categoría existente en vez de duplicarla', async () => {
    const first = await useCase.execute({ name: 'Cómputo' })
    const second = await useCase.execute({ name: 'Cómputo' })

    expect(second.id).toBe(first.id)
    expect(await repository.findAll()).toHaveLength(1)
  })

  it('recorta espacios antes de comparar/guardar', async () => {
    await useCase.execute({ name: 'Oficina' })
    const result = await useCase.execute({ name: '  Oficina  ' })

    const all = await repository.findAll()

    expect(all).toHaveLength(1)
    expect(result.id).toBe(all[0].id)
  })

  it('propaga errores que no son de nombre duplicado', async () => {
    repository.save = async () => {
      throw new Error('DB caída')
    }

    await expect(useCase.execute({ name: 'Jardín' })).rejects.toThrow('DB caída')
  })

  it('DuplicateCategoryNameError tiene el mensaje correcto', () => {
    const error = new DuplicateCategoryNameError('Hogar')

    expect(error.message).toContain('Hogar')
  })

  it('despacha CategoryCreatedEvent al dispatcher cuando crea una categoría nueva', async () => {
    const dispatcher = new DomainEventDispatcher()
    const received: string[] = []

    dispatcher.subscribe((event) => {
      received.push(event.eventName)
    })

    const useCaseWithSpy = new FindOrCreateCategoryByNameUseCase(
      repository,
      new FakeIdGenerator(),
      dispatcher,
    )

    await useCaseWithSpy.execute({ name: 'Jardinería' })

    expect(received).toEqual(['category.created'])
  })

  it('NO despacha nada si reutiliza una categoría existente', async () => {
    const dispatcher = new DomainEventDispatcher()
    const received: string[] = []
    dispatcher.subscribe((event) => received.push(event.eventName))

    const useCaseWithSpy = new FindOrCreateCategoryByNameUseCase(
      repository,
      new FakeIdGenerator(),
      dispatcher,
    )

    await useCaseWithSpy.execute({ name: 'Deportes' })
    received.length = 0 // limpiamos lo del primer create

    await useCaseWithSpy.execute({ name: 'Deportes' }) // ya existe

    expect(received).toEqual([])
  })
})
