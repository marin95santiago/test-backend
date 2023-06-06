import { type NextFunction, type Request, type Response } from 'express'
import { DynamoDBStoreRepository } from '../../../../implementations/AWS/dynamo-db/DynamoDBStoreRepository'
import { StoreCreatorUseCase } from '../../../../../application/useCases/StoreCreator'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const createStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    code,
    name,
    address,
    state,
    county,
    postalCode
  } = req.body

  const { sessionUser } = req.params

  const dynamoDBStoreRepository = new DynamoDBStoreRepository()
  const storeCreatorUseCase = new StoreCreatorUseCase(dynamoDBStoreRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.store.create, session.data.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const storeCreated = await storeCreatorUseCase.run({
      code,
      name,
      address,
      state,
      county,
      postal_code: postalCode
    })

    res.json(storeCreated)
  } catch (error) {
    next(error)
  }
}
