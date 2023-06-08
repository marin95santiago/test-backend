import { type NextFunction, type Request, type Response } from 'express'
import { StoreDeleterUseCase } from '../../../../../application/useCases/StoreDeleter'
import { DynamoDBStoreRepository } from '../../../../implementations/AWS/dynamo-db/DynamoDBStoreRepository'
import { S3ListRepository } from '../../../../implementations/AWS/s3/S3ListRepository'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const deleteStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { sessionUser } = req.params
  const code = req.params.code

  const dynamoDBStoreRepo = new DynamoDBStoreRepository()
  const listRepository = new S3ListRepository()
  const storeDeleterUseCase = new StoreDeleterUseCase(dynamoDBStoreRepo, listRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.store.delete, session.data.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    await storeDeleterUseCase.run(code)
    res.json()
  } catch (e) {
    next(e)
  }
}
