export class StoreNotFoundException extends Error {
  constructor () {
    super('Store not found')
  }
}
