import { type NextFunction, type Request, type Response } from 'express'
import { DynamoDBStoreRepository } from '../../../../implementations/AWS/dynamo-db/DynamoDBStoreRepository'
import { StoreGetterUseCase } from '../../../../../application/useCases/StoreGetter'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getAllStores = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser } = req.params
  const { limit, lastEvaluatedKey } = req.query

  const params = {
    limit: limit !== undefined ? Number(limit) : undefined,
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    lastEvaluatedKey: lastEvaluatedKey !== undefined ? JSON.parse(lastEvaluatedKey.toString()) : undefined
  }

  const dynamoDBStoreRepository = new DynamoDBStoreRepository()
  const storeGetterUseCase = new StoreGetterUseCase(dynamoDBStoreRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.store.view, session.data.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    const response = await storeGetterUseCase.run(params.limit, params.lastEvaluatedKey)
    res.json(response)
  } catch (e) {
    next(e)
  }
}
