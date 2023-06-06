import { type User } from 'domain/entities/User.entity'

export interface UserRepository {
  save: (user: User) => Promise<User>
  getByUserName: (username: string) => Promise<User | null>
  getById: (id: string) => Promise<User | null>
}
