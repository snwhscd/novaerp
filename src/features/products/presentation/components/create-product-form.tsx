'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ProductType } from '@/features/products/domain/enums/product-type'
import {
  createProductAction,
  type CreateProductActionState,
} from '@/features/products/presentation/actions/create-product.action'
import {
  NEW_BRAND_OPTION_VALUE,
  NEW_CATEGORY_OPTION_VALUE,
} from '@/features/products/presentation/schemas/create-product.schema'
import { Button } from '@/shared/presentation/components/ui/button'
import { FieldError, Label } from '@/shared/presentation/components/ui/label'
import { Input } from '@/shared/presentation/components/ui/input'
import { Select } from '@/shared/presentation/components/ui/select'

const initialState: CreateProductActionState = { success: false }

const productTypeOptions: { value: ProductType; label: string }[] = [
  { value: ProductType.PHYSICAL, label: 'Físico' },
  { value: ProductType.SERVICE, label: 'Servicio' },
  { value: ProductType.DIGITAL, label: 'Digital' },
]

export interface BrandOption {
  id: string
  name: string
}

export interface CategoryOption {
  id: string
  name: string
}

export function CreateProductForm({
  brands,
  categories,
}: {
  brands: BrandOption[]
  categories: CategoryOption[]
}) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createProductAction, initialState)
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    if (state.success) {
      router.push('/products')
    }
  }, [state.success, router])

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state.message && !state.success ? (
        <p className="rounded-default border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" placeholder="Silla ergonómica" required />
          <FieldError messages={state.fieldErrors?.name} />
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Descripción</Label>
          <Input id="description" name="description" placeholder="Opcional" />
          <FieldError messages={state.fieldErrors?.description} />
        </div>

        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" placeholder="Se genera automático si se deja vacío" />
          <FieldError messages={state.fieldErrors?.sku} />
        </div>

        <div>
          <Label htmlFor="barcode">Código de barras</Label>
          <Input id="barcode" name="barcode" placeholder="Opcional" />
          <FieldError messages={state.fieldErrors?.barcode} />
        </div>

        <div>
          <Label htmlFor="productType">Tipo</Label>
          <Select id="productType" name="productType" defaultValue={ProductType.PHYSICAL}>
            {productTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <FieldError messages={state.fieldErrors?.productType} />
        </div>

        <div>
          <Label htmlFor="categoryId">Categoría</Label>
          <Select
            id="categoryId"
            name="categoryId"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            required
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
            <option value={NEW_CATEGORY_OPTION_VALUE}>+ Otra (nueva categoría)</option>
          </Select>
          <FieldError messages={state.fieldErrors?.categoryId} />

          {selectedCategory === NEW_CATEGORY_OPTION_VALUE ? (
            <div className="mt-2">
              <Input
                id="newCategoryName"
                name="newCategoryName"
                placeholder="Nombre de la nueva categoría"
                autoFocus
              />
              <FieldError messages={state.fieldErrors?.newCategoryName} />
            </div>
          ) : null}
        </div>

        <div className="col-span-2">
          <Label htmlFor="brandId">Marca</Label>
          <Select
            id="brandId"
            name="brandId"
            value={selectedBrand}
            onChange={(event) => setSelectedBrand(event.target.value)}
          >
            <option value="">Sin marca</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
            <option value={NEW_BRAND_OPTION_VALUE}>+ Otra (nueva marca)</option>
          </Select>
          <FieldError messages={state.fieldErrors?.brandId} />

          {selectedBrand === NEW_BRAND_OPTION_VALUE ? (
            <div className="mt-2">
              <Input
                id="newBrandName"
                name="newBrandName"
                placeholder="Nombre de la nueva marca"
                autoFocus
              />
              <FieldError messages={state.fieldErrors?.newBrandName} />
            </div>
          ) : null}
        </div>

        <div>
          <Label htmlFor="costPrice">Precio de costo</Label>
          <Input id="costPrice" name="costPrice" type="number" step="0.01" min="0" required />
          <FieldError messages={state.fieldErrors?.costPrice} />
        </div>

        <div>
          <Label htmlFor="salePrice">Precio de venta</Label>
          <Input id="salePrice" name="salePrice" type="number" step="0.01" min="0" required />
          <FieldError messages={state.fieldErrors?.salePrice} />
        </div>

        <div className="col-span-2 flex items-center gap-2">
          <input
            id="trackInventory"
            name="trackInventory"
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-line text-accent focus-visible:ring-accent"
          />
          <Label htmlFor="trackInventory" className="mb-0">
            Rastrear inventario de este producto
          </Label>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Guardando…' : 'Crear producto'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
