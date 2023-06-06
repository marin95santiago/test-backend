import { createUser } from './user/createUser.controller'

// Login controller
import { login } from './login/login.controller'
import { validateToken } from './login/validateToken.controller'

export {
  createUser as createUserController,
  login as loginController,
  validateToken as validateTokenController
}
