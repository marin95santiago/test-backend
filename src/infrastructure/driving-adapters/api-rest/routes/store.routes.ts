import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'

import {
  createStoreController,
  getAllStoresController
} from '../controllers/index'

const route = Router()

route.post('', validateToken, createStoreController)
route.get('', validateToken, getAllStoresController)

export default route
