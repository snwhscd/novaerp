import { beforeEach, describe, expect, it } from 'vitest'

import { Brand, BrandId } from '@/features/brands/domain/entities/brand'
import { DuplicateBrandNameError } from '@/features/brands/domain/errors/duplicate-brand-name.error'
import { BrandRepository } from '@/features/brands/domain/repositories/brand.repository'
import { FindOrCreateBrandByNameUseCase } from '@/features/brands/application/use-cases/find-or-create-brand-by-name.use-case'

class InMemoryBrandRepository implements BrandRepository {
  private brands = new Map<string, Brand>()

  // Simula la carrera: si está en true, la próxima llamada a save()
  // lanza DuplicateBrandNameError como lo haría el índice único de Postgres.
  simulateRaceOnNextSave = false

  async save(brand: Brand): Promise<void> {
    if (this.simulateRaceOnNextSave) {
      this.simulateRaceOnNextSave = false
      throw new DuplicateBrandNameError(brand.name)
    }

    this.brands.set(brand.id, brand)
  }

  async update(brand: Brand): Promise<void> {
    this.brands.set(brand.id, brand)
  }

  async delete(id: BrandId): Promise<void> {
    this.brands.get(id)?.delete()
  }

  async findById(id: BrandId): Promise<Brand | null> {
    return this.brands.get(id) ?? null
  }

  async findByName(name: string): Promise<Brand | null> {
    return [...this.brands.values()].find((b) => b.name === name) ?? null
  }

  async findAll(): Promise<Brand[]> {
    return [...this.brands.values()]
  }

  // Helper de test para simular que "alguien más" ya creó la marca
  // justo durante la condición de carrera.
  seedDirectly(brand: Brand) {
    this.brands.set(brand.id, brand)
  }
}

class FakeIdGenerator {
  private counter = 0

  generateId(): string {
    this.counter += 1
    return `id_${this.counter}`
  }
}

const TEST_ORGANIZATION_ID = 'org_test'

describe('FindOrCreateBrandByNameUseCase', () => {
  let repository: InMemoryBrandRepository
  let useCase: FindOrCreateBrandByNameUseCase

  beforeEach(() => {
    repository = new InMemoryBrandRepository()
    useCase = new FindOrCreateBrandByNameUseCase(
      repository,
      new FakeIdGenerator(),
      TEST_ORGANIZATION_ID,
    )
  })

  it('crea una marca nueva si no existe', async () => {
    const result = await useCase.execute({ name: 'Samsung' })

    const saved = await repository.findByName('Samsung')

    expect(saved).not.toBeNull()
    expect(saved?.id).toBe(result.id)
  })

  it('asigna la organización inyectada a la marca creada', async () => {
    const result = await useCase.execute({ name: 'Panasonic' })

    const saved = await repository.findById(result.id)

    expect(saved?.organizationId).toBe(TEST_ORGANIZATION_ID)
  })

  it('reutiliza la marca existente en vez de duplicarla', async () => {
    const first = await useCase.execute({ name: 'LG' })
    const second = await useCase.execute({ name: 'LG' })

    expect(second.id).toBe(first.id)
    expect(await repository.findAll()).toHaveLength(1)
  })

  it('recorta espacios antes de comparar/guardar', async () => {
    await useCase.execute({ name: 'Sony' })
    const result = await useCase.execute({ name: '  Sony  ' })

    const all = await repository.findAll()

    expect(all).toHaveLength(1)
    expect(result.id).toBe(all[0].id)
  })

  it('si pierde la condición de carrera, usa la marca del ganador', async () => {
    // Simula: entre nuestro findByName (que no encuentra nada) y nuestro
    // save(), otra request ya insertó "Xiaomi" -> el save() de esta
    // request truena con DuplicateBrandNameError.
    repository.simulateRaceOnNextSave = true

    const winnerBrand = Brand.create({
      id: 'race_winner',
      organizationId: TEST_ORGANIZATION_ID,
      name: 'Xiaomi',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const original = repository.findByName.bind(repository)
    let callCount = 0

    repository.findByName = async (name: string) => {
      callCount += 1
      // La primera llamada (antes del save) no encuentra nada todavía;
      // recién en la segunda (después de perder la carrera) aparece.
      if (callCount === 1) return null
      repository.seedDirectly(winnerBrand)
      return original(name)
    }

    const result = await useCase.execute({ name: 'Xiaomi' })

    expect(result.id).toBe('race_winner')
  })
})
