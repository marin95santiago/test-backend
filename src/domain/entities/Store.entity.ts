import { type Express } from 'express'

export interface Store {
  code: string
  name: string
  address: string
  state: string
  county?: string
  postalCode?: string
  list?: Express.Multer.File
}
