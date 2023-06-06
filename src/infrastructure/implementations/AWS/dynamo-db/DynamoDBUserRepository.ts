import path from 'path'
import * as dotenv from 'dotenv'
import { DynamoDBClient, PutItemCommand, ScanCommand, GetItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { type User } from 'domain/entities/User.entity'
import { type UserRepository } from '../../../../domain/repositories/User.repository'

dotenv.config({
  path: path.resolve(__dirname, '../../../../../.env')
})

export class DynamoDBUserRepository implements UserRepository {
  private readonly client = new DynamoDBClient({ region: 'us-east-1' })
  private readonly _environment: string = process.env.ENVIRONMENT ?? ''
  private readonly _project: string = process.env.PROJECT ?? ''
  private readonly _table: string = 'Users'

  async save (user: User): Promise<User> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Item: marshall({
        id: user.id ?? '',
        username: user.username ?? '',
        password: user.password ?? '',
        permissions: user.permissions ?? ['']
      })
    }
    await this.client.send(new PutItemCommand(params))

    return user
  }

  async getById (id: string): Promise<User | null> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      Key: marshall({
        id
      })
    }
    const response = await this.client.send(new GetItemCommand(params))

    const item = (response.Item !== undefined) ? response.Item : null

    if (item === null) return null
    const user = {
      id: item.id.S ?? '',
      username: item.username.S ?? '',
      permissions: item.permissions.L !== undefined
        ? item.permissions.L.map(permission => {
          if (permission.S !== undefined) {
            return permission.S
          } else {
            return ''
          }
        })
        : ['']
    }

    return user
  }

  async getByUserName (username: string): Promise<User | null> {
    const params = {
      TableName: `${this._project}-${this._environment}-${this._table}`,
      FilterExpression: 'username = :username',
      ExpressionAttributeValues: marshall({
        ':username': username
      })
    }
    const response = await this.client.send(new ScanCommand(params))

    const item = (response.Items !== undefined && response.Items.length > 0) ? response.Items[0] : null

    if (item === null) return null

    const user = {
      id: item.id.S ?? '',
      username: item.username.S ?? '',
      password: item.password?.S ?? '',
      permissions: item.permissions.L !== undefined
        ? item.permissions.L.map(permission => {
          if (permission.S !== undefined) {
            return permission.S
          } else {
            return ''
          }
        })
        : ['']
    }
    return user
  }
}
