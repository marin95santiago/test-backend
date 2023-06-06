import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'

import {
  createStoreController,
  deleteStoreController,
  getAllStoresController
} from '../controllers/index'

const route = Router()

route.post('', validateToken, createStoreController)
route.get('', validateToken, getAllStoresController)
route.delete('/:code', validateToken, deleteStoreController)

export default route
