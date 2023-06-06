import { Router } from 'express'
// import { validateToken } from '../middlewares/tokenHandler.middleware'

import {
  createUserController
} from '../controllers/index'

const route = Router()

route.post('', createUserController)

export default route
