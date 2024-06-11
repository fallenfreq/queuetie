import type { AugmentedServer } from './index.js'
import type { AugmentedRequest } from './request.js'
import { ServerResponse } from 'http'
import type { JsonSerializable } from '../types/types.js'
import { exposeThrow } from './utils/exposeThrow.js'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import type { checkAgainstSymbol, paramSymbol } from './utils/trie.js'
// export type { checkAgainstSymbol, paramSymbol}

// augment response
const augmentRes = (server:AugmentedServer, req:AugmentedRequest, res:ServerResponse) => {
  const augmntedResponse = Object.assign(res, {
    req,
    locals: {},
    throw: exposeThrow,
    render: undefined as undefined | ((path: string, options:Record<string, unknown>) => unknown),
    status (status: number) {
      res.statusCode = status
      return augmntedResponse
    },
    json (object:JsonSerializable) {
      const data = JSON.stringify(object)
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Length', data.length)
      res.end(data)
    },
    // 302 found - temp move
    // 307 for post
    // 301 permanent
    redirect (redirectPath: string | undefined) {
      res.statusCode = res.statusCode === 200
        ? 302
        : res.statusCode
      const resolvedPath = redirectPath === 'back'
        || !redirectPath
        ? req.headers.referer || '/'
        : redirectPath

      if (req.isAjax && req.accepts('json')) {
        this.json({ redirect: resolvedPath })
      } else {
        res.setHeader('Location', resolvedPath)
        res.end()
      }
    }
  }, server.response)
  return augmntedResponse
}

type AugmentedResponse = ReturnType<typeof augmentRes>
export { augmentRes, type AugmentedResponse }