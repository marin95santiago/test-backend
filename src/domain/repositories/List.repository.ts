import { type Express } from 'express'

export interface ListRepository {
  save: (fileName: string, fileContent: Express.Multer.File) => Promise<void>
  delete: (fileName: string) => Promise<void>
  getListByCode: (fileName: string) => Promise<Express.Multer.File | null>
}
