import { type Request, type Response, Router, type NextFunction } from 'express'
import userRoutes from './user.routes'
import loginRoutes from './login.routes'
import { UserAlreadyExistException } from '../../../../domain/exceptions/user/UserAlreadyExist.exception'
import { UserNotFoundException } from '../../../../domain/exceptions/user/UserNotFound.exception'
import { LoginWrongPasswordException } from '../../../../domain/exceptions/user/LoginWrongPassword.exception'
import { PermissionNotAvailableException } from '../../../../domain/exceptions/common/PermissionNotAvailable.exception'
import { MissingPropertyException } from '../../../../domain/exceptions/common/MissingProperty.exception'

const route = Router()

route.use('/api/users', userRoutes)
route.use('/api/login', loginRoutes)

route.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof UserAlreadyExistException) {
    res.status(400).json({
      message: err.message
    })
  } else if (err instanceof UserNotFoundException) {
    res.status(400).json({
      message: err.message
    })
  } else if (err instanceof LoginWrongPasswordException) {
    res.status(400).json({
      message: err.message
    })
  } else if (err instanceof PermissionNotAvailableException) {
    res.status(403).json({
      message: err.message
    })
  } else if (err instanceof MissingPropertyException) {
    res.status(400).json({
      message: err.message
    })
  } else {
    next(err)
  }
})

route.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  res.status(500)
  res.json({
    error: err
  })
})

export default route
