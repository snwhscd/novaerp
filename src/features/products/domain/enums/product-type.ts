export const ProductType = {
  PHYSICAL: 'PHYSICAL',
  SERVICE: 'SERVICE',
  DIGITAL: 'DIGITAL',
} as const

export type ProductType = (typeof ProductType)[keyof typeof ProductType]
