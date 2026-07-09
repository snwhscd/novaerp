import { ulid } from 'ulid'

import { IdGenerator } from './id-generator'

export class UlidIdGenerator implements IdGenerator {
  generateId(): string {
    return ulid()
  }
}
