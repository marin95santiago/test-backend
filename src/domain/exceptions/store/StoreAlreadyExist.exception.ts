export class StoreAlreadyExistException extends Error {
  constructor () {
    super('Store already exist')
  }
}
