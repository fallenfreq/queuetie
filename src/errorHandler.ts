import type { MiddlewareCall } from './utils/trie.js'
import type { AugmentedRequest } from './request.js'
import type { AugmentedResponse } from './response.js'
import type { ServerError } from './utils/exposeThrow.js'

// 502 Bad Gateway
// 503 Service Unavailable
// 504 Gateway Timeout

const errorMessagesMap:Record<number, string> = {
  500: 'Internal Server Error',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'You are not authorized to view this page', // Forbidden',
  404: 'Not Found',
  408: 'Confilct',
  411: 'Length Required',
  413: 'Data is too long'
} 

const errorMessages = (status: number):string =>
  errorMessagesMap[status] || 'Error'

const exposeErr = (
  req:AugmentedRequest,
  res:AugmentedResponse,
  message:string) => {
    
  if (req.isAjax && req.accepts('json')) {
    return res.json({ error: message })
  }
  
  if (req.accepts('html') && res.render) {
    return res.render('error', { err: message })
  }

  if (req.accepts('json')) {
    return res.json({ error: message })
  }

  if (req.accepts('text')) {
    return res.end('Error: ' + message)
  }

  req.app.emit('error',
    `No Valid way to expose the err to client: ${message}`)

  res.end() // err code is returned
}

const isError = (err:unknown): err is ServerError => 
  err instanceof Error

// Catches errors that bubble back through the app
const errorHandler:MiddlewareCall = async (req, res, next) => {
  try {
    await next()
  } catch (e) {
    const err = typeof e === 'string' ? Error(e) : e 
    if (isError(err)) {
      const status = err.status || 500
      res.status(status)
      const message = err.expose
        ? err.message || errorMessages(status)
        : errorMessages(status)
      if (err.handler) err.handler(message)
      else exposeErr(req, res, message)
      if (!err.expose) {
        req.app.emit('error', err)
      }
    } else  req.app.emit('error', Error(`Not instanceof Error "${err}"`))
  }
}

export { errorHandler }
