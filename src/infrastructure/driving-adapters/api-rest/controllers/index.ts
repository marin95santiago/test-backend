// User controllers
import { createUser } from './user/createUser.controller'

// Login controllers
import { login } from './login/login.controller'
import { validateToken } from './login/validateToken.controller'

// Store controllers
import { createStore } from './store/createStore.controller'
import { getAllStores } from './store/getAllStores.controller'

export {
  createUser as createUserController,
  login as loginController,
  validateToken as validateTokenController,
  createStore as createStoreController,
  getAllStores as getAllStoresController
}
