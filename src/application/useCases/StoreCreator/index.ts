import { type StoreRepository } from '../../../domain/repositories/Store.repository'
import { ExistStoreByCodeService } from '../../../domain/services/store/ExistStoreByCode.service'
import { StoreAlreadyExistException } from '../../../domain/exceptions/store/StoreAlreadyExist.exception'
import { type Store } from '../../../domain/entities/Store.entity'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'

export class StoreCreatorUseCase {
  private readonly _storeRepository: StoreRepository
  private readonly _existStoreByCodeService: ExistStoreByCodeService

  constructor (storeRepository: StoreRepository) {
    this._storeRepository = storeRepository
    this._existStoreByCodeService = new ExistStoreByCodeService(storeRepository)
  }

  async run (body: Store): Promise<Store> {
    // validate if store already exist
    const existStore: boolean = await this._existStoreByCodeService.run(body.code)
    if (existStore) throw new StoreAlreadyExistException()

    // Validate required fields
    if (body.code === undefined || body.code === '') throw new MissingPropertyException('code')
    if (body.name === undefined || body.name === '') throw new MissingPropertyException('name')
    if (body.address === undefined || body.address === '') throw new MissingPropertyException('address')
    if (body.state === undefined || body.state === '') throw new MissingPropertyException('state')

    await this._storeRepository.save(body)

    return body
  }
}
