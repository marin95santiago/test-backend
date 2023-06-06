import express from 'express'
import type * as http from 'http'
import routes from './routes'

export class Server {
  private readonly _port: string
  private readonly _app: express.Express
  private _httpServer?: http.Server

  constructor (port: string) {
    this._port = port
    this._app = express()
    this._app.use(express.json())
    this._app.use(express.urlencoded({ extended: false }))
    this._app.use(routes)
  }

  async listen (): Promise<void> {
    await new Promise<void>(resolve => {
      this._httpServer = this._app.listen(this._port, () => {
        console.log(
          `Mock Backend App is running at http://localhost:${this._port}`
        )
        console.log('  Press CTRL-C to stop\n')
        resolve()
      })
    })
  }

  async stop (): Promise<void> {
    await new Promise<void | void>((resolve, reject) => {
      if (this._httpServer != null) {
        this._httpServer.close((error: any) => {
          if (error != null) {
            reject(error)
          }
          resolve()
        })
      }

      resolve()
    })
  }
}
