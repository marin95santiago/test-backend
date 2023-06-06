import { Router } from 'express'

import {
  loginController,
  validateTokenController
} from '../controllers/index'

const route = Router()

route.post('', loginController)
route.get('', validateTokenController)

export default route
