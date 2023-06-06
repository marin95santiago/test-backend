import { type NextFunction, type Request, type Response } from 'express'
import { DynamoDBUserRepository } from '../../../../implementations/AWS/dynamo-db/DynamoDBUserRepository'
import { LoginUseCase } from '../../../../../application/useCases/Login'

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, password } = req.body
  const secret = process.env.SECRET ?? ''
  const dynamoDBUserRepo = new DynamoDBUserRepository()
  const loginUseCase = new LoginUseCase(dynamoDBUserRepo)

  try {
    const result = await loginUseCase.run(username, password, secret)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
