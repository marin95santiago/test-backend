import { type StoreRepository } from '../../../domain/repositories/Store.repository'
import { StoreNotFoundException } from '../../../domain/exceptions/store/StoreNotFound.exception'
import { GetStoreByCodeService } from '../../../domain/services/store/GetStoreByCode.service'
import { type ListRepository } from '../../../domain/repositories/List.repository'

export class StoreDeleterUseCase {
  private readonly _storeRepository: StoreRepository
  private readonly _listRepository: ListRepository
  private readonly _getStoreByCodeService: GetStoreByCodeService

  constructor (storeRepository: StoreRepository, listRepository: ListRepository) {
    this._storeRepository = storeRepository
    this._listRepository = listRepository
    this._getStoreByCodeService = new GetStoreByCodeService(storeRepository)
  }

  async run (code: string): Promise<void> {
    const storeToUpdate = await this._getStoreByCodeService.run(code)

    if (storeToUpdate === null) throw new StoreNotFoundException()

    await Promise.all([this._storeRepository.delete(code), this._listRepository.delete(code)])
  }
}
