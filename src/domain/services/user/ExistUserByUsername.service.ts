import { type UserRepository } from '../../../domain/repositories/User.repository'

export class ExistUserByUsernameService {
  private readonly _userRepository: UserRepository

  constructor (userRepository: UserRepository) {
    this._userRepository = userRepository
  }

  /**
   * Return true or false if username already exist
   * @param username {string}
   * @returns {boolean} true or false
   */
  async run (username: string): Promise<boolean> {
    const user = await this._userRepository.getByUserName(username)

    // exist return true
    if (user !== null) return true

    return false
  }
}
