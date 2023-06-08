import { type Express } from 'express'
import { type ListRepository } from '../../../domain/repositories/List.repository'

export class StoreListGetterUseCase {
  private readonly _listRepository: ListRepository

  constructor (listRepository: ListRepository) {
    this._listRepository = listRepository
  }

  async run (code: string): Promise<Express.Multer.File> {
    const file = await this._listRepository.getListByCode(code)
    if (file === null) {
      throw new Error('Error descargando archivo')
    } else {
      return file
    }
  }
}
