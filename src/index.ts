import * as http from 'http'
import * as https from 'https'

import { errorHandler } from './errorHandler.js'
import { augmentReq, type AugmentedRequest } from './request.js'
import { augmentRes, type AugmentedResponse } from './response.js'

import middleware from './utils/middleware.js'
import servStatic from './utils/static.js'
import { parseBody } from './utils/parseBody.js'
import { createTrie, methods, type Method, type MiddlewareCall, type TrieNodeRoot } from './utils/trie.js'
import router from './utils/router.js'

import type { ServerError } from './utils/exposeThrow.js'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import type { checkAgainstSymbol, paramSymbol } from './utils/trie.js'

type HttpsServerOptions = https.ServerOptions<typeof http.IncomingMessage, typeof http.ServerResponse>
type ServerOptions = {
  redirectStatus?: 302 | 301;
  httpsRedirect?: boolean;
  httpPort?: number;
  httpsRedirectPort?: number;
  httpsOptions?: HttpsServerOptions;
} & ({
  httpsRedirect: false;
  httpsOptions?: never;
} | {
  httpsRedirect: true;
  httpsOptions: HttpsServerOptions;
})

// Redirect from http default for use without a reverse proxy like nginx
const httpsServer = (
  {
    httpsOptions = {},
    httpPort=5175,
    httpsRedirectPort=5174,
    redirectStatus=302 }: ServerOptions) => {  

  http.createServer((req, res) => {
    if (!req.headers.host || !req.url) {
      res.statusCode = 400
      res.end('Bad Request')
      return
    }
    // using 302 instead of 301 as it's for dev and I dont want it cached
    res.writeHead(redirectStatus, {
      Location: 'https://'
      + req.headers.host.split(':')[0]
      + ':' + httpsRedirectPort 
      + req.url
    })

    res.end()
  }).listen({ port:httpPort })
  return https.createServer(httpsOptions)
}

type AugmentedServer = ReturnType<typeof augmentServer>

const augmentServer = (serverOptions:ServerOptions = { httpsRedirect:false }) => {
  const server = serverOptions.httpsRedirect
    ? httpsServer(serverOptions)
    : http.createServer()

  const originalListen = server.listen

  const trie:TrieNodeRoot = createTrie()
  const augmentedServer = Object.assign(server, trie, {
    parseBody,
    locals: {},
    request: {},
    response: {},
    static: servStatic,
    listenAsync (...args: Parameters<typeof originalListen>):Promise<ReturnType<typeof originalListen>> {
      return new Promise((resolve) => {
        const lastArg:unknown = args[args.length-1]
        if (typeof lastArg !== 'function') args.push(() => resolve(listener))
        else args.push(() => { lastArg(); resolve(listener) })
        const listener = originalListen.bind(server)(...args)
      })
    }
  })
  augmentedServer.root = augmentedServer
  return augmentedServer
}

function assertIsValidMethod(method: http.IncomingMessage['method']): asserts method is Method {
  if (!method) throw Error(`Invalid method type "${method}"`)
  for (const validMethod of methods) {    
    if (method === validMethod) return
  }
  throw Error(`Invalid method type "${method}"`)
}

type ConfirmedReqProps = { headers: { host: string }, url: string, method: Method }

function hasInitProps(req: http.IncomingMessage): req is http.IncomingMessage & ConfirmedReqProps {
  assertIsValidMethod(req.method)
  return typeof req.headers.host === 'string' && typeof req.url === 'string'
}

const initServer = (server:AugmentedServer) => {
  // remove leading slashs from urls. I also have nginx doing this
  server.use(({ pathname, url, method }, res, next) => {
    if (/\S+\/$/.test(pathname) && method === 'GET') {
      const query = url.slice(pathname.length)
      res.status(301).redirect(pathname.slice(0, -1) + query)
    } else return next()
  })

  server.use(errorHandler)
  server.on('error', (err:ServerError) => {
    console.log('centralised error handling:')
    let i = 0
    let cause:ServerError | undefined = err
    do {
      console.log('Cause depth:', i, cause)
      i++
    } while ((cause = cause.cause))
    if (err.exit) process.exit(1)
  })

  server.on('request', (req, res) => {
    if (!hasInitProps(req)) {
      res.statusCode = 400
      res.end('Bad Request')
      return
    }

    const augmentedReq = augmentReq(server, req)
    const augmentedRes = augmentRes(server, augmentedReq, res)
    middleware(augmentedReq, augmentedRes)
  })

  return server
}

const createServer = (serverOptions?:ServerOptions) => {
  return initServer(augmentServer(serverOptions))
}

export type {
  AugmentedServer,
  ConfirmedReqProps,
  AugmentedRequest,
  AugmentedResponse,
  MiddlewareCall
}
export { router as createRouter }
export default createServer
