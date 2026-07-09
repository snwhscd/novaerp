import { ProductType } from '@/features/products/domain/enums/product-type'

export interface CreateProductDto {
  sku?: string
  barcode?: string

  name: string
  description?: string

  productType: ProductType

  costPrice: number
  salePrice: number

  trackInventory?: boolean

  brandId?: string
  categoryId: string
}
