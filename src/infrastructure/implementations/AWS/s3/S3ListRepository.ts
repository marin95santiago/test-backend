import path from 'path'
import * as dotenv from 'dotenv'
import { type Express } from 'express'
import { Readable } from 'stream'
import { type ListRepository } from 'domain/repositories/List.repository'
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, type GetObjectCommandOutput } from '@aws-sdk/client-s3'

dotenv.config({
  path: path.resolve(__dirname, '../../../../../.env')
})

export class S3ListRepository implements ListRepository {
  private readonly s3Client = new S3Client({ region: 'us-east-1' })
  private readonly _environment: string = process.env.ENVIRONMENT ?? ''
  private readonly _bucketName: string = `${this._environment.toLowerCase()}-list-test`

  async save (code: string, fileContent: Express.Multer.File): Promise<void> {
    const folderName = code
    const params = {
      Bucket: this._bucketName,
      Key: `${folderName}/${code}`,
      Body: fileContent.buffer,
      ContentType: fileContent.mimetype
    }

    await this.s3Client.send(new PutObjectCommand(params))
  }

  async delete (code: string): Promise<void> {
    const folderName = code
    const params = {
      Bucket: this._bucketName,
      Key: `${folderName}/${code}`
    }

    await this.s3Client.send(new DeleteObjectCommand(params))
  }

  async getListByCode (code: string): Promise<Express.Multer.File | null> {
    const folderName = code
    const params = {
      Bucket: this._bucketName,
      Key: `${folderName}/${code}`
    }

    const command = new GetObjectCommand(params)
    const response: GetObjectCommandOutput = await this.s3Client.send(command)

    if (response.Body instanceof Readable) {
      const chunks: Uint8Array[] = []

      for await (const chunk of response.Body) {
        chunks.push(chunk)
      }

      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: code,
        encoding: '',
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: chunks.reduce((acc, chunk) => acc + chunk.length, 0),
        buffer: Buffer.concat(chunks),
        stream: new Readable(),
        destination: '',
        filename: code,
        path: ''
      }

      return file
    }

    return null
  }
}
