import { type UserRepository } from '../../../domain/repositories/User.repository'
import { type User } from '../../../domain/entities/User.entity'

export class GetUserByUsernameService {
  private readonly _userRepository: UserRepository

  constructor (userRepository: UserRepository) {
    this._userRepository = userRepository
  }

  /**
   * Return user data
   * @param username {string}
   * @returns {User}
   */
  async run (username: string): Promise<User | null> {
    const user = await this._userRepository.getByUserName(username)

    return user
  }
}
