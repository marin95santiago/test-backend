import { type StoreRepository } from '../../../domain/repositories/Store.repository'
import { type ListRepository } from '../../../domain/repositories/List.repository'
import { ExistStoreByCodeService } from '../../../domain/services/store/ExistStoreByCode.service'
import { StoreAlreadyExistException } from '../../../domain/exceptions/store/StoreAlreadyExist.exception'
import { type Store } from '../../../domain/entities/Store.entity'
import { MissingPropertyException } from '../../../domain/exceptions/common/MissingProperty.exception'

export class StoreCreatorUseCase {
  private readonly _storeRepository: StoreRepository
  private readonly _listRepository: ListRepository
  private readonly _existStoreByCodeService: ExistStoreByCodeService

  constructor (storeRepository: StoreRepository, listRepository: ListRepository) {
    this._storeRepository = storeRepository
    this._listRepository = listRepository
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
    if (body.list === undefined) throw new MissingPropertyException('list')

    await Promise.all([this._storeRepository.save(body), this._listRepository.save(body.code, body.list)])

    // for response
    delete body.list
    return body
  }
}
