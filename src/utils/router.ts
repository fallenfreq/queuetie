import { createTrie } from './trie.js'
import middleware from './middleware.js'
import type { MiddlewareCall, TrieNode } from './trie.js'

type RouterCall = MiddlewareCall & TrieNode

const router = ():RouterCall => {
  const trie = createTrie()
 
  const routerCall:MiddlewareCall = async function (req, res, next) {
    const {
      queue: parentQueue,
      queueIndex: parentIndex,
      prefixSegments: parentPrefixSegments,
      pathname: fullPathname,
      method
    } = req
    const { segments, _call } = this
    if (!('collect' in _call))
      throw Error('Router is missing trie methods')
    
    const pathname = fullPathname.split('/')
      .filter(seg => seg).splice(segments
        .filter(segment => !/\+$/.test(segment)).length)

    // prefix segments of mountRouter as you collect by placing in new object
    // prefix it with route segments above
    req.queue = _call.collect(pathname, method, segments)
    
    req.prefixSegments = segments

    // if the nested queue is not done (finished early)
    // then don't continue the main queue
    const result = await middleware(req, res)
    if (!result.done) return

    req.queue = parentQueue
    req.queueIndex = parentIndex
    if (parentPrefixSegments)
      req.prefixSegments = parentPrefixSegments
    return next()
  }

  const mountableRouter = Object.assign(routerCall, trie)
  mountableRouter.root = mountableRouter
  return mountableRouter 
}

export type { RouterCall }
export default router
