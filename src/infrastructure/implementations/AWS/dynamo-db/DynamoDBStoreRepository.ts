import path from 'path'
import * as dotenv from 'dotenv'
import { DynamoDBClient, PutItemCommand, ScanCommand, GetItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { type Store } from 'domain/entities/Store.entity'
import { type StoreRepository } from 'domain/repositories/Store.repository'

dotenv.config({
  path: path.resolve(__dirname, '../../../../../.env')
})

export class DynamoDBStoreRepository implements StoreRepository {
  private readonly client = new DynamoDBClient({ region: 'us-east-1' })
  private readonly _environment: string = process.env.ENVIRONMENT ?? ''
  private readonly _project: string = process.env.PROJECT ?? ''
  private readonly _table: string = 'Stores'

  async save (store: Store): Promise<Store> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Item: marshall({
        code: store.code ?? '',
        name: store.name ?? '',
        address: store.address ?? '',
        state: store.state ?? '',
        county: store.county ?? null,
        postal_code: store.postal_code ?? null
      })
    }
    await this.client.send(new PutItemCommand(params))

    return store
  }

  async getByCode (code: string): Promise<Store | null> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Key: marshall({
        code
      })
    }
    const response = await this.client.send(new GetItemCommand(params))

    const item = (response.Item !== undefined) ? response.Item : null

    if (item === null) return null
    const store = {
      code: item.code.S ?? '',
      name: item.name.S ?? '',
      address: item.address.S ?? '',
      state: item.state.S ?? '',
      county: item.county.S ?? undefined,
      postal_code: item.postal_code.S ?? undefined
    }

    return store
  }

  async getAll (limit?: number, lastEvaluatedKey?: any): Promise<{ lastEvaluatedKey: any, stores: Store[] }> {
    const params: {
      TableName: string
      ExclusiveStartKey?: any
      Limit?: number
    } = {
      TableName: `${this._project}-${this._environment}-${this._table}`
    }

    if (limit !== undefined) {
      params.Limit = limit
    }

    if (lastEvaluatedKey !== undefined) {
      params.ExclusiveStartKey = lastEvaluatedKey
    }
    const response = await this.client.send(new ScanCommand(params))

    const items = (response.Items !== undefined) ? response.Items : []

    const stores = items.map((item: any) => {
      return {
        code: item.code.S ?? '',
        name: item.name.S ?? '',
        address: item.address.S ?? '',
        state: item.state.S ?? '',
        county: item.county.S ?? undefined,
        postal_code: item.postal_code.S ?? undefined
      }
    })

    return {
      lastEvaluatedKey: response.LastEvaluatedKey,
      stores
    }
  }

  async delete (code: string): Promise<void> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Key: marshall({
        code
      })
    }
    await this.client.send(new DeleteItemCommand(params))
  }
}
