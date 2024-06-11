import type { AugmentedRequest } from '../request.js'
import type { AugmentedResponse } from '../response.js'
import type { Next } from './middleware.js'
import type { RouterCall } from './router.js'

// Using symbols is causing an error
// Exported variable 'secureProcedure' has or is using name 'paramSymbol' from external module "" but cannot be named.ts(4023)

const paramSymbol = 'someUniqueKeyParamSymbol' // Symbol('param')
const checkAgainstSymbol = 'someUniqueKeycheckAgainstSymbol' // Symbol('checkAgainst')

const round = (value:number, precision:number):number => {
  const multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

const regexHandler = (regex:RegExp, contains = false):string => {
  const source = regex.source
  regexStore[source] = regex
  return '(' + source + ')' + (contains ? '+' : '')
}

const segmentPath = (path:RoutePath):string[] => {
  const segments = typeof path === 'string'
    ? path.split('/').filter(segment => segment)
    : path instanceof RegExp
      ? [regexHandler(path, true)]
      : path
  
  return segments.map((segment) => 
    segment instanceof RegExp
      ? regexHandler(segment)
      : segment
  )
}

const createMiddlewareItem = (
  trie:TrieNode,
  segments:string[],
  ...middlewareCalls:Middleware[]) => {  
  const indexedMiddleware:IndexedMiddleware = {}
  for (const middlewareCall of middlewareCalls) {
    const index = trie.inc()
    const middleware:QueueIteam = Object.assign(
      '_call' in middlewareCall
        ? {
          ...middlewareCall,
          groupIndex: middlewareCall.groupIndex
            ?? middlewareCall.index ?? null
        }
        : { _call: middlewareCall }, {
        index,
        segments: [...trie.segments, ...segments]
      })
    // storing as groupIndex so that they overwrite eachother on collection
    // that way only one match will run for optionalParams 
    indexedMiddleware[middleware.groupIndex ?? index] = middleware
  }
  
  return indexedMiddleware
}

// once typescript can infer parents type based on props, I can remove this
const isTrieNode = (leaf:TrieNode | LeafBasic): leaf is TrieNode => {
  return typeof leaf.use === 'function'
}

// if key is a http method then parent can be a trieNode
function setLeaf (parent:TrieNode, key:Method):LeafBase
function setLeaf (parent:LeafBasic, key:string, isParam?:boolean):LeafBase 
function setLeaf (parent:TrieNode | LeafBasic, key:Method | string, isParam?:boolean):LeafBase  {
  const leafBase:LeafBase = {
    segments: [],
    children: {},
    middleware: {},
    match: false,
    ...isParam ? { isParam: key } : {}
  }

  return isTrieNode(parent)
    ? parent[key as Method] ||= leafBase
    : parent[key] ||= leafBase
}
   

const getParamsRegex = (segment:string) => {
  const [/* both */, /* {param} */,
    param, /* (regex) */, regex] = segment
    .match(/({([^}]*)})?(\((.+)\))?/) || []
  if (regex) regexStore[regex] = new RegExp(regex)
  return { param, regex }
}

const paramsRegexLeaf = (parent:Leaf, segment:string) => {
  const { param, regex } = getParamsRegex(segment)

  const checkAgainstBranch = () => {
    const branch = parent.children[checkAgainstSymbol] ||= {}
    return setLeaf(branch, (regex || '.+'))
  }

  const paramsBranch = (checkAgainstBranch:Leaf) => {
    if (param) {
      const branch = checkAgainstBranch[paramSymbol] ||= {}
      return setLeaf(branch, param, true)
    } else return checkAgainstBranch
  }

  return (param || regex)
    ? paramsBranch(checkAgainstBranch())
    : setLeaf(parent.children, segment)
}

function optionalParam (trie: TrieNode, segments: string[]): [string[], Leaf][]
function optionalParam (
  trie:TrieNode,
  segments: string[],
  httpMethod:MethodLowerCase | undefined,
  indexedMiddleware:IndexedMiddleware): void
function optionalParam (
  trie:TrieNode,
  segments:string[],
  httpMethod?:MethodLowerCase,
  indexedMiddleware?:IndexedMiddleware) {
  let n = 0
  for (const segment of segments) {
    if (/\?$/.test(segment)) n++
  }

  const binaryCombos = (n:number):string[] => {
    const combos = []
    let max = 2 << (n - 1)
    while (max > 0) {
      combos.push(
        (max -= 1).toString(2)
          .padStart(n, '0'))
    }
    return combos
  }

  const binaries = binaryCombos(n)
  const combinations = binaries.map(binary => {
    let optionalIndex = 0
    return segments.reduce((route, segment) => {
      const isOptional = /\?$/.test(segment)
      if (isOptional) {
        if (Number(binary.charAt(optionalIndex))) {
          route.push(segment.slice(0, -1))
        }
        optionalIndex++
      } else if (!isOptional) {
        route.push(segment)
      }
      return route
    }, Array<string>())
  })

  // recall add() with amended middleware and segment combinations
  if (indexedMiddleware) {
    const [firstMiddleware, ...middlewares] = Object.values(indexedMiddleware)
    if (!firstMiddleware) throw Error('No middleware provided')
    for (const combination of combinations) {     
      trie[httpMethod || 'use'](combination, firstMiddleware,...middlewares)
    }
    // return array of leafs for prefix to return to route
    // route.use calls etc will be deligated to all combinations
  } else {
    return combinations.map(combination =>
      [combination, prefix(combination, trie)])
  }
}

// kinda like add but takes no middlewareCall
const prefix = (path:RoutePath, trie:TrieNode):Leaf | [string[], Leaf][] => {
  const segments = segmentPath(path)
  // this is for trie.route() so the params on the mw prop are correct
  const params = [...trie?.params || []]
  let i = 0, parent:Leaf = trie

  for (let segment of segments) {
    if (/\?$/.test(segment)) { // if optional
      return optionalParam(trie, segments)
    }
    if (/\+$/?.test(segment)) {
      parent.contains ||= setLeaf({}, 'contains')
      segment = segment.slice(0, -1)
      parent = parent.contains
    }
    const leaf = paramsRegexLeaf(parent, segment)
    if (leaf.isParam) params.push(leaf.isParam)
    if (i === segments.length - 1) leaf.params = params
    parent = leaf
    i++
  }
  return parent
}

const assignMiddleware = (
  middlewares:LeafBase['middleware'],
  indexedMiddleware:IndexedMiddleware,
  params = {}) => {
  if (Array.isArray(params)) {
    for (const [index, middleware] of Object.entries(indexedMiddleware)) {      
      middleware.params = params
      middlewares[Number(index)] = middleware
    }
  } else Object.assign(middlewares, indexedMiddleware)
}

type AddMethods = {
  <T extends RoutePath | Middleware>(this:TrieNode, path:T, ...middleware: T extends RoutePath
      ? [Middleware, ...Middleware[]]
      : [...Middleware[]]): TrieNode
}

const add = (httpMethod?:MethodLowerCase):AddMethods => {
  function addMethods(this:TrieNode, ...args:[path:RoutePath | Middleware, ...middlewareCall:Middleware[]]): TrieNode {
    // eslint-disable-next-line prefer-const
    let [path, ...middlewareCall] = args
    if (typeof path === 'function'
      || typeof path === 'object' && '_call' in path) {
      middlewareCall.unshift(path)
      path = '/'
    }

    const trieType:Leaf = httpMethod
      ? setLeaf(this, httpMethod.toUpperCase() as Method)
      : this

    const segments = segmentPath(path)
    const indexedMiddleware = createMiddlewareItem(this, segments, ...middlewareCall)
    
    // this is for this.route() so the params on the middleware prop are correct
    const params = [...this.params || []]

    if (!segments.length) {
      trieType.match = true
      assignMiddleware(trieType.middleware, indexedMiddleware, params)
      return this
    }

    let i = 0, parent = trieType
    for (let segment of segments) {
      if (/\?$/.test(segment)) { // if optional
        optionalParam(this, segments, httpMethod, indexedMiddleware)
        break
      }
      // contains is like children but checks against remaingSegments
      if (/\+$/?.test(segment)) {
        this.contains ||= setLeaf({}, 'contains')
        segment = segment.slice(0, -1)
        parent = this.contains
      }
      const leaf = paramsRegexLeaf(parent, segment)
      if (leaf.isParam) params.push(leaf.isParam)
      if (i === segments.length - 1) {
        leaf.match = true
        assignMiddleware(leaf.middleware, indexedMiddleware, params)
      }
      parent = leaf
      i++
    }

    return this
  }
  return addMethods
}


const addALL = function (this:TrieNode, path:string | string[], firstMiddleware:Middleware,...middlewareCall:Middleware[] ) {
  methodsLowerCase.forEach((method) => {
    this[method](path, firstMiddleware, ...middlewareCall)
  })
  return this
}

const addPreParam = function (this:TrieNode, params:string | string[], ...middlewareCall:Middleware[]) {
  const paramsAry = typeof params === 'string' ? [params] : params
  for (const param of paramsAry) {
    // MiddlewareItems are made during collection because there index and segemnts change
    // depending on when they need to be run
    (this.root.paramMiddlewareCalls[param] ||= [])
      .push(...middlewareCall)
  }
}

const preParam = (
  indexedMiddleware:IndexedMiddleware,
  paramsStore:ParamsStore,
  lowestIndex:LowestIndex,
  indexedParamsStore:IndexedParamsStore) => {
  const indexedMiddlewareEntry = Object.entries(indexedMiddleware)[0]
  if (!indexedMiddlewareEntry) throw Error('Middleware missing')
  const [iString, middleware] = indexedMiddlewareEntry
  
  if (middleware.params) {
    const i = Number(iString)
    for (const param of middleware.params) {
      const curLowestIndex = lowestIndex[param] ??= i
      if (curLowestIndex <= i) continue
      lowestIndex[param] = i
    }
    // paramsStore will contain more than one param for one segment
    // if different names have been used for the same segment on different routes
    // the middleware.params is used to filter this
    indexedParamsStore[i] = middleware.params
      .reduce<Record<string, string>>((acc, param) => {
        const segment = paramsStore[param]
        if (!segment) throw Error('No segment for param found')
        acc[param] = segment
        return acc
      }, {})
  }
}

type SearchBranch = (leaf:Leaf, currentSegments:string[], paramsStore?:ParamsStore | undefined) => void

const searchOtherBranches = (
  parent:Leaf, segment:string, i:number, currentSegments:string[], searchBranch:SearchBranch, paramsStore:ParamsStore) => {
  const checkAgainstBranch = parent.children[checkAgainstSymbol]
  if (checkAgainstBranch) {
    for (const [condition, branch] of Object.entries(checkAgainstBranch)) {
      if (regexStore[condition]?.test(segment)) {
        searchBranch(branch, currentSegments.slice(i + 1))
        const paramsBranch = branch[paramSymbol]
        if (paramsBranch) {
          // will contain more than one param if different names have
          // been used for the same segment on different routes
          for (const [param, paramBranch] of Object.entries(paramsBranch)) {
            paramsStore[param] = segment
            searchBranch(paramBranch, currentSegments.slice(i + 1), paramsStore)
          }
        }
      }
    }
  }
}


const collectMethod = (leaf:Leaf, segments:string[], paramsStore:ParamsStore | undefined,
  lowestIndex:LowestIndex, indexedParamsStore:IndexedParamsStore) => {
  const indexedMiddleware:IndexedMiddleware = {}

  const searchMethodBranch = (leaf:Leaf, currentSegments:string[], paramsStore:ParamsStore | undefined) => {    
    if (leaf.match && !currentSegments.length) {
      if (paramsStore)
        preParam(leaf.middleware, paramsStore, lowestIndex, indexedParamsStore)
      Object.assign(indexedMiddleware, leaf.middleware)
    }

    let parent = leaf, i = 0

    for (const segment of  currentSegments) {
      searchOtherBranches(parent, segment, i, currentSegments, searchMethodBranch, { ...paramsStore })
      const leaf = parent.children[segment]
      if (!leaf) break
      if (i === currentSegments.length - 1 && leaf.match) {
        if (paramsStore)
          preParam(leaf.middleware, paramsStore, lowestIndex, indexedParamsStore)
        Object.assign(indexedMiddleware, leaf.middleware)
      }
      parent = leaf
      i++
    }

  }
  searchMethodBranch(leaf, segments, paramsStore)
  
  return indexedMiddleware
}


const collect = function (
  this:TrieNodeRoot,
  pathname:string | string[],
  method:Method,
  prefixSegments:string[] = []) {
  const segments = segmentPath(pathname)
  const indexedMiddleware:IndexedMiddleware = {}
  const indexedMiddlewareCombined:Record<number, QueueIteam[]> = {}
  const lowestIndex:LowestIndex = {}
  const indexedParamsStore:IndexedParamsStore = {}
  
  const checkForContains = (parent:Leaf, remaingSegments:string[], paramsStore:ParamsStore | undefined) => {
    const { contains } = parent
    if (contains) {
      const { children } = contains
      for (const segment of remaingSegments) {
        const leaf = children[segment]
        if (leaf) {
          searchBranch(leaf, remaingSegments, paramsStore)
        }
      }
      const checkAgainst = children[checkAgainstSymbol]
      if (checkAgainst) {
        const remaingPath = remaingSegments.join('/')
        for (const condition of Object.keys(checkAgainst)) {
          if (regexStore[condition]?.test(remaingPath)) {
            const regexLeaf = checkAgainst[condition]
            if (regexLeaf) {
              searchBranch(regexLeaf, remaingSegments, paramsStore)
            }
          }
        }
      }
    }
  }

  const checkForMethodBranch = (leaf:Leaf, remaingSegments:string[], paramsStore:ParamsStore | undefined) => {
    const methodUppercase = method.toUpperCase() as Method
    const methodBranch = 'use' in leaf && leaf[methodUppercase]
    if (!methodBranch) return
    const methodMiddleware = collectMethod(
      methodBranch,
      remaingSegments,
      paramsStore,
      lowestIndex,
      indexedParamsStore
    )
    // preParam runs inside collectMethod
    Object.assign(indexedMiddleware, methodMiddleware)
  }

  // the searchMethodBranch varation dosent use checkFor..'s'
  // and only matches if it's the last segment
  const searchBranch = (leaf:Leaf, currentSegments:string[], paramsStore?:ParamsStore) => {
    checkForContains(leaf, currentSegments, paramsStore)
    checkForMethodBranch(leaf, currentSegments, paramsStore)

    if (leaf.match) {
      if (paramsStore)
        preParam(leaf.middleware, paramsStore, lowestIndex, indexedParamsStore)
      Object.assign(indexedMiddleware, leaf.middleware)
    }

    let parent = leaf, i = 0

    for (const segment of currentSegments) {
      searchOtherBranches(parent, segment, i, currentSegments, searchBranch, { ...paramsStore })
      const leaf = parent.children[segment]
      if (leaf) {
        const remaingSegments = currentSegments.slice(i + 1)
        checkForContains(leaf, remaingSegments, paramsStore)
        checkForMethodBranch(leaf, remaingSegments, paramsStore)
      } else break
      if (leaf.match) {
        if (paramsStore)
          preParam(leaf.middleware, paramsStore, lowestIndex, indexedParamsStore)
        Object.assign(indexedMiddleware, leaf.middleware)
      }
      parent = leaf
      i++
    }
    
  }
  searchBranch(this.root, segments)

  // setParamKey and place paramMiddleware before 1st middleware that uses param
  const lowestIndexGrouped:Record<number, string[]> = {}
  const paramMiddlewareCount:Record<number, number> = {}

  for (const param of Object.keys(lowestIndex)) {
    const qi = Number(lowestIndex[param])
    const paramMiddlewareCalls = this.root.paramMiddlewareCalls[param] || []
    paramMiddlewareCount[qi] = (paramMiddlewareCount[qi] || 1)
      + paramMiddlewareCalls.length // + 1 for setParamKey
    if (paramMiddlewareCalls.length) paramMiddlewareCount[qi] += 1
    ;(lowestIndexGrouped[qi] ||= []).push(param)
  }
  
  for (const [qiString, params] of Object.entries(lowestIndexGrouped)) {
    const qi = parseInt(qiString)
    const middleware = indexedMiddleware[qi]
    if (!middleware) throw Error('Middleware missing')
    const { segments } = middleware
    const count = paramMiddlewareCount[qi]
    if (count === undefined) throw Error('Param Middleware Count missing')
    let index = round(qi // +1 for setParamsCall
          - ((count + 1) / 100), 2)

    const wrap:(_call:Middleware) => QueueIteam = _call => {
      return  Object.assign(
        '_call' in _call
          ? _call
          : { _call }, {
          index: (index = round(index + 0.01, 2)),
          segments
        })
    }

    // declared with a variable to name _call
    const setParamsCall:MiddlewareCall = (req, res, next) => {
      Object.assign(req.params ||= {}, indexedParamsStore[qi])
      return next()
    }

    const combined = [wrap(setParamsCall)]
    for (const param of params) {
      const paramMiddlewareCalls = this.root.paramMiddlewareCalls[param]
      if (!paramMiddlewareCalls) continue
      // declared with a variable to name _call
      const setParamKeyCall:MiddlewareCall = (req, res, next) => {
        req.paramKey = param
        return next()
      }

      const middlewareArray = [wrap(setParamKeyCall)]
      for (const paramMiddlewareCall of paramMiddlewareCalls) {          
        middlewareArray.push(wrap(paramMiddlewareCall))
      }
      combined.push(...middlewareArray)
    }
    
    combined.push(middleware)
    indexedMiddlewareCombined[qi] = combined
  }

  // having index as key allows for quicker look up,
  // it allows the middleware to be collected in order
  // and for groupIndex to overwrite each other
  const mergeMountRouterSegs = (middleware:QueueIteam) => {
    // if mountableRouter
    return 'use' in middleware._call
      ? {
        ...middleware,
        segments: [...prefixSegments, ...middleware.segments]
      }
      : middleware
  }
  const queue = []
  
  for (const qiString of Object.keys(indexedMiddleware)) {
    const qi = parseInt(qiString)
    const middleware = indexedMiddleware[Number(qi)]
    if (!middleware) throw Error('Middleware not found')
    const combinedMiddleware = indexedMiddlewareCombined[qi]
    if (combinedMiddleware) {
      for (const each of combinedMiddleware) {
        queue.push(mergeMountRouterSegs(each))
      }
    } else queue.push(mergeMountRouterSegs(middleware))
  }

  return queue
}


type MethodProps<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T as T[K] extends ((...args: any[]) => any)
  ? K : never]: T[K]
}

type DelegatorMethods<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => infer Return
    ? (this:DelegatorMethods<T>,...args: Args) => Return extends void ? void : DelegatorMethods<T>
    : never
}

type MultiRoute = DelegatorMethods<MethodProps<TrieNodeBase>>

const createMultiRoute = <T extends (TrieNode | MethodProps<TrieNodeBase>)[]>(leafs:T) => {
  // deligate method calls out to all leafs
  const delegator: MultiRoute = {} as MultiRoute
  const nestedMultiRouteLeafs:(TrieNode | MethodProps<TrieNode> )[] = []
  for (const key of  [...methodsLowerCase, 'all', 'use', 'param', 'route'] as (keyof MultiRoute)[]) {
    delegator[key] = function (...args) {
      for (const obj of leafs) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const method = obj[key] as (...args: any[]) => any
        const result = method.apply(obj, args)
        if (key === 'route') {
          nestedMultiRouteLeafs.push(result)
        }
      }
      return nestedMultiRouteLeafs.length
        ? createMultiRoute(nestedMultiRouteLeafs)
        : this
    }
  }
  return delegator
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function route<S extends string>(str: S): S extends `${infer _}?${infer _}` ? MultiRoute : TrieNode
function route(this:TrieNode, path:string): MultiRoute | TrieNode
function route(this:TrieNode, path:string): MultiRoute | TrieNode {
  const segments = segmentPath(path)
  const leaf = prefix(segments, this)
    
  if (Array.isArray(leaf)) {
    const leafs:TrieNode[] = []
    for (const [combination, each] of leaf) {
      if (!('use' in each)) {
        each.segments = [...this.segments, ...combination]
        createTrie(each, this.root)
      }
      // they have all been converted to TrieNodes now
      leafs.push(each as TrieNode)
    }
    return createMultiRoute(leafs)
  } else {
    leaf.segments = [...this.segments, ...segments]
    return createTrie(leaf, this.root)
  }
}

const regexStore:Record<string, RegExp> = {
  '.+': /.+/
}

type LowestIndex = Record<string, number>
type ParamsStore = Record<string, string>
type IndexedParamsStore = Record<number, ParamsStore>
type RoutePath = RegExp | string | (RegExp | string)[]

type MiddlewareCall = (
  this: QueueIteam,
  request: AugmentedRequest,
  response: AugmentedResponse,
  next: Next) => unknown

type QueueIteamCall = MiddlewareCall | RouterCall

type QueueIteam = {
  _call: QueueIteamCall,
  index: number,
  segments: string[],
  groupIndex?: number | null,
  params?: string[]
}

type Middleware = QueueIteamCall
  | Pick<QueueIteam, '_call'>
    & Partial<Pick<QueueIteam, 'index' | 'groupIndex'>>

type IndexedMiddleware = Record<number, QueueIteam>

type LeafKeys = string

type SymbolChildren = {
  [checkAgainstSymbol]?: Record<LeafKeys, Leaf>
  [paramSymbol]?: Record<LeafKeys, Leaf>
}

type LeafBasic = Record<LeafKeys, Leaf>
  & SymbolChildren

type LeafBase = {
  // there might only be a few exception here to it being Leaf
  // so I could name the props that are Record<LeafKeys, Leaf>
  children: LeafBasic,
  middleware: Record<number, QueueIteam>,
  match: boolean,
  segments: string[],
  isParam?: string,
  params?: string[],
  contains?: Leaf
} & SymbolChildren

type TrieNodeRootBase = {
  paramMiddlewareCalls: Record<string, Middleware[]>,
  middlewareCount: number,
  isRoot: true
}

type TrieNodeBase = {
  all: typeof addALL,
  inc: () => number,
  count: () => number,
  use: AddMethods,
  collect: (pathname: string|string[], method: Method, prefixSegments?: string[]) => QueueIteam[],
  param: typeof addPreParam,
  route: typeof route,
  root: TrieNodeRoot,
}
& {[M in Method]?: Leaf }
& {[M in MethodLowerCase]: AddMethods }
& LeafBase

type TrieNodeRoot = TrieNodeRootBase & TrieNodeBase
type TrieNode = TrieNodeRoot | TrieNodeBase
type Leaf = TrieNode | LeafBase


type Method = typeof methods[number]
type MethodLowerCase = typeof methodsLowerCase[number]

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] as const
const methodsLowerCase =  ['get', 'post', 'put', 'delete', 'options'] as const


function createTrie (trie?:TrieNodeRoot, root?:TrieNodeRoot):TrieNodeRoot
function createTrie (trie:LeafBase, root:TrieNodeRoot):TrieNode
function createTrie (
  trie:TrieNodeRoot | LeafBase = {
    segments: [],
    paramMiddlewareCalls: {},
    middlewareCount: 0,
    middleware: {},
    children: {},
    match: false,
    isRoot: true
  },
  root?:TrieNodeRoot
): TrieNodeRoot | TrieNode {
  if (!root && 'isRoot' in trie) root = trie
  if (!root) throw Error('root must be set if trie is a leaf')
  // root should be changed when it's mapped to a new object
  const initRoot = root

  const methods_ = {} as {[M in MethodLowerCase]: AddMethods }
  for (const httpMethod of methodsLowerCase) {
    methods_[httpMethod] = add(httpMethod)
  }


  const result = Object.assign(trie, methods_, {
    inc() { return this.root.middlewareCount++ },
    count () { return this.root.middlewareCount },
    all: addALL,
    use: add(),
    collect,
    param: addPreParam,
    route,
    root: initRoot
  })

  return result
}


export {
  createTrie,
  methods,
  methodsLowerCase
}

export type {
  TrieNode,
  TrieNodeRoot,
  LeafBase,
  Method,
  MethodLowerCase,
  Middleware,
  MiddlewareCall,
  QueueIteamCall,
  QueueIteam,
  // paramSymbol,
  // checkAgainstSymbol,
  DelegatorMethods
}

// TESTING BELLOW
//

// const req = {
//   method: 'GET' as const,
//   pathname: 't/xxx/doop/more',
//   url: '',
//   queue: Array<QueueIteam>()
// } as unknown as AugmentedRequest

// import router from './router.js'
// import middleware from './middleware.js'

// const trie = createTrie()
// const r = router()
 
// const appTest = Object.assign({}, trie)
// appTest.root = appTest

// r.use((req, res, next) => {
//   console.log('a ran')
//   return next()
// })

// appTest.use((req, res, next) => {
//   console.log('running')
//   try {
//     next()
//   } catch (Error) {
//     console.log({ Error })
//   }
//   return next()
// }, r)

// middleware(Object.assign(req, {
//   queue:appTest.collect(req.pathname, req.method)
// }), {} as AugmentedResponse)


// trie.param('second', (req, res, next) => {
//   if (!('params' in req && 'paramKey' in req))
//     throw Error('Params are missing')
//   console.log(2,
//     req.params[req.paramKey],
//     'runs before 1st matched route that uses param'
//   )
//   return next()
// }, (req, res, next) => {
//   console.log(3, '2nd fn in param mw')
//   return next()
// })

// trie.param('first', (req, res, next) => {
//   if (!('params' in req && 'paramKey' in req))
//     throw Error('Params are missing')
//   console.log(1,
//     req.params[req.paramKey],
//     'runs before 1st matched route that uses param.'
//     // 'if two app.param params match on the same path, order of execution deepends on param order {first}/{second}.',
//     // 'First param might only need to run for middleware later in the queue.',
//     // '\n'
//   )
//   return next()
// })


// trie.use('{first}/{second}', (req, res, next) => {
//   console.log(4, req.params,'both')
//   return next()
// },
// (req, res, next) => {
//   console.log(5, '2nd fn in mw')
//   return next()
// })

// trie.use('t/xxx/{woop}', (req, res, next) => {
//   console.log('woop')
//   return next()
// })

//   .use('{xxx}', (req, res, next) => {
//     return next()
//   })


// trie.use('t?/xxx/{second}/more', (req, res, next) => {
//   console.log(req.params, 'one')
//   return next()
// })


// trie.route('(\\w+)').use('{second}', (req, res, next) => {
//   console.log(req.params,'two')
//   return next()
// })
//   .param('second', (req, res, next) => {
//     if (!(req.params && req.paramKey))
//       throw Error('Params are missing')
//     console.log(
//       req.params[req.paramKey],
//       'Runs before 1st matched route that uses param even in router'
//     )
//     return next()
//   })

// trie.route('{xxx}')
//   .use('{second}(\\w+)', (req, res, next) => {
//     if (!(req.params && req.paramKey))
//       throw Error('Params are missing')
//     console.log(req.params,'three')
//     return next()
//   })
//   .use('doop+', (req, res, next) => {
//     console.log('Matches xxx route & contains doop')
//     return next()
//   })

// trie.param('start', ({ paramKey, params }, res, next) => {
//   if (!(params && paramKey))
//     throw Error('Params are missing')
//   console.log({ paramKey, params, param: params[paramKey] })
//   return next()
// })

// trie.use('{start}/xxx?/doop?/more?', function opt(req, res, next) {
//   console.log('One time run for all optional matches')
//   console.log({
//     prefixSegments: req.prefixSegments,
//     this: req.queue[req.queueIndex],
//     queueIndex: req.queueIndex,
//     pathname: req.pathname
//   })
//   next()
// },
// (req, res, next) => {
//   console.log('second fn')
//   next()
// })

// trie.route('{start}/xxx?').use(['doop?', 'more?'], function optRoute(req, res, next) {
//   console.log('One time run for all optional matches in route')
//   console.log({
//     prefixSegments: req.prefixSegments,
//     this: req.queue[req.queueIndex],
//     queueIndex: req.queueIndex,
//     pathname: req.pathname
//   })
//   next()
// })

// const a = router()
// const b = router() 

// trie.route('t/xxx/doop/{more}').use((req, res, next) => {
//   console.log(req.params)
//   return next()
// })
// trie.use(a)

// a.param('doopParam', (req, res, next) => {
//   if (!('params' in req && 'paramKey' in req))
//     throw Error('Params are missing')
//   console.log('param: '
//     + req.paramKey
//     + ': ' + req.params[req.paramKey || '']
//   )
//   return next()
// })

// a.use('{doopParam}(doop)', b, (req, res, next) => {
//   console.log(req.params)
//   console.log('a')
//   return next()
// })

// b.use(['doop?', /^m\w*e$/], (req, res, next) => {
//   console.log('b')
//   return next()
// })
// trie.route('{t}').use('xxx', a)

// trie.use('doop+', (req, res, next) => {
//   console.log('contains doop')
//   return next()
// })

// const lev1 = trie.route('t?')
// lev1.route('(mo)+?/xxx')
//   .use('xxx?/doop/{last}', (req, res, next) => {
//     console.log('wtf')
//     return next()
//   })


// const queue = trie.collect(req.pathname, req.method)
// req.queue = queue
// console.log('queue: ',
//   queue
// ) 
// middleware(req, {} as AugmentedResponse)

// features
// regex - (\\w+)
// params {paramName}
// params/regex {paramName}(\\w+)
// optional segments some/seg?
// finalCallPath contains seg+
// pre param preprocessing

// back slash your back slash for regex
// middleware added togeather share the same index

// path args are not bothered about leading or traling slashes
// string is turned into an aray of segments and empty ones are filterd

// can have more than one optional segment
// optional operator should be last if used with contains operator +?
// optional segments will only match one time for all combinations
// unless using optional on route and then again on the returned multiRoute
// for example .route('one/two?').route('three/four?')
// then you get one for each match on each route
// matches with more segments have priority because collect uses
// depth 1st search and later matches overide earlier ones with the same index
// optional segments can be used in route
// you can pass mutiple middleware at once

// methods are exact match
// use means path is starting with

// router and the defualt route support chaning
// route can be chained to create nested routes

// using contains on a route only checks to see if route contains
// anything to the right of the contains is still checked as
// though the contins segment was never there
// just passing a regex on it's own is like using contains
// if regex is in an array it just checks the segment

// if two app.param params match on the same path, order of execution deepends on param order {first}/{second}
// and the order of matched middleware as the first param might only need to run for middleware later in the queue
// adding multiple functions to param at the same time, order is guaranteed
// app.param looks for params on the entire path regradles of it being used on a route or not
// req.params are set before the first route that conatins them
// app.param will only run once rather than once for each named param in the matched middleware

// by using a param segment, you're saying add this segment to req.params under {thisKey}
// if you use the same key elsewhere it will overide
// if you use different {keys} on the same segment on different routes, you'll get two props for that segment
// if the param is used inside a router, use, router.param(someParma => ()) to run code before it

// in middleware, this === req.queue[req.queueIndex]
// index is only used by optional
// trie.segments is only used by trie.router

// all params are checked against a regex, if one is not set .+ is used
// you can pass in actual regexp's if its in an array of segments

// groupIndex is 1 less than the first middleware with the index because its the index of
// the middleware that went through optionalParams and was discarded