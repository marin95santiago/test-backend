import { type Store } from 'domain/entities/Store.entity'

export interface StoreRepository {
  save: (store: Store) => Promise<Store>
  getByCode: (code: string) => Promise<Store | null>
  getAll: (limit?: number, lastEvaluatedKey?: any) => Promise<{ lastEvaluatedKey: any, stores: Store[] }>
}
