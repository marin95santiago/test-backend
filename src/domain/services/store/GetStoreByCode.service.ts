import { type Store } from 'domain/entities/Store.entity'
import { type StoreRepository } from 'domain/repositories/Store.repository'

export class GetStoreByCodeService {
  private readonly _storeRepository: StoreRepository

  constructor (storeRepository: StoreRepository) {
    this._storeRepository = storeRepository
  }

  /**
   * Return store by code
   * @param code {string}
   * @returns {Store}
   */
  async run (code: string): Promise<Store | null> {
    const store = await this._storeRepository.getByCode(code)

    return store
  }
}
