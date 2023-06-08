import { type NextFunction, type Request, type Response } from 'express'
import { S3ListRepository } from '../../../../implementations/AWS/s3/S3ListRepository'
import { StoreListGetterUseCase } from '../../../../../application/useCases/StoreListGetter'
import { validatePermission } from '../../utils'
import permissionsList from '../../permission.json'
import { PermissionNotAvailableException } from '../../../../../domain/exceptions/common/PermissionNotAvailable.exception'

export const getStoreList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const code = req.params.code
  const { sessionUser } = req.params

  const s3ListRepository = new S3ListRepository()
  const storeListGetterUseCase = new StoreListGetterUseCase(s3ListRepository)

  try {
    const session = JSON.parse(sessionUser)
    const doesSuperAdminHavePermission = true
    const havePermission = validatePermission(permissionsList.store.download_list, session.data.permissions, doesSuperAdminHavePermission)

    if (!havePermission) throw new PermissionNotAvailableException()

    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const file = await storeListGetterUseCase.run(code)

    res.send(file)
  } catch (error) {
    next(error)
  }
}
