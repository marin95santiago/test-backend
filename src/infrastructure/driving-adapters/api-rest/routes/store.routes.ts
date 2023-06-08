import { Router } from 'express'
import { validateToken } from '../middlewares/tokenHandler.middleware'
import multer from 'multer'

import {
  createStoreController,
  deleteStoreController,
  getAllStoresController,
  getStoreListController
} from '../controllers/index'

const route = Router()
const upload = multer()

route.post('', validateToken, upload.single('list'), createStoreController)
route.get('', validateToken, getAllStoresController)
route.delete('/:code', validateToken, deleteStoreController)
route.get('/:code', validateToken, getStoreListController)

export default route
