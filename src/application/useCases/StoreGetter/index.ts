import { type Store } from '../../../domain/entities/Store.entity'
import { type StoreRepository } from '../../../domain/repositories/Store.repository'

export class StoreGetterUseCase {
  private readonly _storeRepository: StoreRepository

  constructor (storeRepository: StoreRepository) {
    this._storeRepository = storeRepository
  }

  async run (limit?: number, lastEvaluatedKey?: any): Promise<{ lastEvaluatedKey: any, stores: Store[] }> {
    const stores: { lastEvaluatedKey: any, stores: Store[] } = await this._storeRepository.getAll(limit, lastEvaluatedKey)
    return stores
  }
}
