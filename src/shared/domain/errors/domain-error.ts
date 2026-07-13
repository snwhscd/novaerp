// Clase base para TODOS los errores de dominio, de cualquier feature.
// Vive en shared porque el concepto "esto es una regla de negocio violada,
// no un bug" no pertenece a products, categories, ni a ningún feature en
// particular. Además, capas más arriba (p. ej. un error boundary global,
// o el manejo de errores en un Server Action) suelen querer hacer
// `error instanceof DomainError` sin importar de qué feature vino.
export abstract class DomainError extends Error {
  protected constructor(message: string) {
    super(message)

    this.name = new.target.name
  }
}
