// User controllers
import { createUser } from './user/createUser.controller'

// Login controllers
import { login } from './login/login.controller'
import { validateToken } from './login/validateToken.controller'

// Store controllers
import { createStore } from './store/createStore.controller'
import { getAllStores } from './store/getAllStores.controller'
import { deleteStore } from './store/deleteStore.controller'
import { getStoreList } from './store/getStoreList.controller'

export {
  createUser as createUserController,
  login as loginController,
  validateToken as validateTokenController,
  createStore as createStoreController,
  getAllStores as getAllStoresController,
  deleteStore as deleteStoreController,
  getStoreList as getStoreListController
}
