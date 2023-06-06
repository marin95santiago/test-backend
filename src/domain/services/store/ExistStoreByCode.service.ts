import { type StoreRepository } from '../../../domain/repositories/Store.repository'

export class ExistStoreByCodeService {
  private readonly _storeRepository: StoreRepository

  constructor (storeRepository: StoreRepository) {
    this._storeRepository = storeRepository
  }

  /**
   * Return true or false if store already exist
   * @param code {string}
   * @returns {boolean} true or false
   */
  async run (code: string): Promise<boolean> {
    const store = await this._storeRepository.getByCode(code)

    // exist return true
    if (store !== null) return true

    return false
  }
}
