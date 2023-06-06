import { type StoreRepository } from '../../../domain/repositories/Store.repository'
import { StoreNotFoundException } from '../../../domain/exceptions/store/StoreNotFound.exception'
import { GetStoreByCodeService } from '../../../domain/services/store/GetStoreByCode.service'

export class StoreDeleterUseCase {
  private readonly _storeRepository: StoreRepository
  private readonly _getStoreByCodeService: GetStoreByCodeService

  constructor (storeRepository: StoreRepository) {
    this._storeRepository = storeRepository
    this._getStoreByCodeService = new GetStoreByCodeService(storeRepository)
  }

  async run (code: string): Promise<void> {
    const storeToUpdate = await this._getStoreByCodeService.run(code)

    if (storeToUpdate === null) throw new StoreNotFoundException()

    await this._storeRepository.delete(code)
  }
}
