import { ProductType } from '@/features/products/domain/enums/product-type'
import { InvalidCategoryError } from '@/features/products/domain/errors/invalid-category.error'
import { InvalidProductNameError } from '@/features/products/domain/errors/invalid-product-name.error'
import { InvalidProductPriceError } from '@/features/products/domain/errors/invalid-product-price.error'
import { InvalidSkuError } from '@/features/products/domain/errors/invalid-sku.error'

export type ProductId = string

export interface CreateProductProps {
  id: ProductId
  organizationId: string

  sku: string
  barcode?: string

  name: string
  description?: string

  productType: ProductType

  costPrice: number
  salePrice: number

  trackInventory: boolean

  brandId?: string
  categoryId: string

  createdAt: Date
  updatedAt: Date
}

export interface ProductProps extends CreateProductProps {
  deletedAt?: Date
}

export class Product {
  private constructor(private props: ProductProps) {}

  static create(props: CreateProductProps): Product {
    this.validate(props)

    return new Product({
      ...props,
      deletedAt: undefined,
    })
  }

  static reconstitute(props: ProductProps): Product {
    return new Product(props)
  }

  private static validate(props: CreateProductProps): void {
    this.validateName(props.name)
    this.validateSku(props.sku)
    this.validateCategory(props.categoryId)
    this.validatePrices(props.costPrice, props.salePrice)
  }

  private static validateName(name: string): void {
    if (!name.trim()) {
      throw new InvalidProductNameError()
    }
  }

  private static validateSku(sku: string): void {
    if (!sku.trim()) {
      throw new InvalidSkuError()
    }
  }

  private static validateCategory(categoryId: string): void {
    if (!categoryId.trim()) {
      throw new InvalidCategoryError()
    }
  }

  private static validatePrices(costPrice: number, salePrice: number): void {
    if (costPrice < 0 || salePrice < 0) {
      throw new InvalidProductPriceError()
    }
  }

  get id() {
    return this.props.id
  }

  get organizationId() {
    return this.props.organizationId
  }

  get sku() {
    return this.props.sku
  }

  get barcode() {
    return this.props.barcode
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get productType() {
    return this.props.productType
  }

  get costPrice() {
    return this.props.costPrice
  }

  get salePrice() {
    return this.props.salePrice
  }

  get trackInventory() {
    return this.props.trackInventory
  }

  get brandId() {
    return this.props.brandId
  }

  get categoryId() {
    return this.props.categoryId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get deletedAt() {
    return this.props.deletedAt
  }

  rename(name: string): void {
    Product.validateName(name)

    this.props.name = name
    this.touch()
  }

  changeDescription(description?: string): void {
    this.props.description = description
    this.touch()
  }

  changeSalePrice(price: number): void {
    Product.validatePrices(this.props.costPrice, price)

    this.props.salePrice = price
    this.touch()
  }

  changeCostPrice(price: number): void {
    Product.validatePrices(price, this.props.salePrice)

    this.props.costPrice = price
    this.touch()
  }

  assignBrand(brandId?: string): void {
    this.props.brandId = brandId
    this.touch()
  }

  changeCategory(categoryId: string): void {
    Product.validateCategory(categoryId)

    this.props.categoryId = categoryId
    this.touch()
  }

  enableInventoryTracking(): void {
    this.props.trackInventory = true
    this.touch()
  }

  disableInventoryTracking(): void {
    this.props.trackInventory = false
    this.touch()
  }

  delete(): void {
    if (!this.props.deletedAt) {
      this.props.deletedAt = new Date()
      this.touch()
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }
}
