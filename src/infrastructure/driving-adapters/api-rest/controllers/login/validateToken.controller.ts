import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'

export const validateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { authorization } = req.headers
  const secret = process.env.SECRET ?? ''
  try {
    const info = jwt.verify(authorization ?? '', secret)
    res.json(info)
  } catch (error) {
    next(error)
  }
}
