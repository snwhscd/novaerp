export interface SkuGenerator {
  generateSku(): Promise<string>
}
