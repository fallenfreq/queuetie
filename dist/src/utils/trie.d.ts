import type { AugmentedRequest } from '../request.js';
import type { AugmentedResponse } from '../response.js';
import type { Next } from './middleware.js';
import type { RouterCall } from './router.js';
declare const paramSymbol = "someUniqueKeyParamSymbol";
declare const checkAgainstSymbol = "someUniqueKeycheckAgainstSymbol";
type AddMethods = {
    <T extends RoutePath | Middleware>(this: TrieNode, path: T, ...middleware: T extends RoutePath ? [Middleware, ...Middleware[]] : [...Middleware[]]): TrieNode;
};
declare const addALL: (this: TrieNode, path: string | string[], firstMiddleware: Middleware, ...middlewareCall: Middleware[]) => TrieNode;
declare const addPreParam: (this: TrieNode, params: string | string[], ...middlewareCall: Middleware[]) => void;
type MethodProps<T> = {
    [K in keyof T as T[K] extends ((...args: any[]) => any) ? K : never]: T[K];
};
type DelegatorMethods<T> = {
    [K in keyof T]: T[K] extends (...args: infer Args) => infer Return ? (this: DelegatorMethods<T>, ...args: Args) => Return extends void ? void : DelegatorMethods<T> : never;
};
type MultiRoute = DelegatorMethods<MethodProps<TrieNodeBase>>;
declare function route<S extends string>(str: S): S extends `${infer _}?${infer _}` ? MultiRoute : TrieNode;
declare function route(this: TrieNode, path: string): MultiRoute | TrieNode;
type RoutePath = RegExp | string | (RegExp | string)[];
type MiddlewareCall = (this: QueueIteam, request: AugmentedRequest, response: AugmentedResponse, next: Next) => unknown;
type QueueIteamCall = MiddlewareCall | RouterCall;
type QueueIteam = {
    _call: QueueIteamCall;
    index: number;
    segments: string[];
    groupIndex?: number | null;
    params?: string[];
};
type Middleware = QueueIteamCall | Pick<QueueIteam, '_call'> & Partial<Pick<QueueIteam, 'index' | 'groupIndex'>>;
type LeafKeys = string;
type SymbolChildren = {
    [checkAgainstSymbol]?: Record<LeafKeys, Leaf>;
    [paramSymbol]?: Record<LeafKeys, Leaf>;
};
type LeafBasic = Record<LeafKeys, Leaf> & SymbolChildren;
type LeafBase = {
    children: LeafBasic;
    middleware: Record<number, QueueIteam>;
    match: boolean;
    segments: string[];
    isParam?: string;
    params?: string[];
    contains?: Leaf;
} & SymbolChildren;
type TrieNodeRootBase = {
    paramMiddlewareCalls: Record<string, Middleware[]>;
    middlewareCount: number;
    isRoot: true;
};
type TrieNodeBase = {
    all: typeof addALL;
    inc: () => number;
    count: () => number;
    use: AddMethods;
    collect: (pathname: string | string[], method: Method, prefixSegments?: string[]) => QueueIteam[];
    param: typeof addPreParam;
    route: typeof route;
    root: TrieNodeRoot;
} & {
    [M in Method]?: Leaf;
} & {
    [M in MethodLowerCase]: AddMethods;
} & LeafBase;
type TrieNodeRoot = TrieNodeRootBase & TrieNodeBase;
type TrieNode = TrieNodeRoot | TrieNodeBase;
type Leaf = TrieNode | LeafBase;
type Method = typeof methods[number];
type MethodLowerCase = typeof methodsLowerCase[number];
declare const methods: readonly ["GET", "POST", "PUT", "DELETE", "OPTIONS"];
declare const methodsLowerCase: readonly ["get", "post", "put", "delete", "options"];
declare function createTrie(trie?: TrieNodeRoot, root?: TrieNodeRoot): TrieNodeRoot;
declare function createTrie(trie: LeafBase, root: TrieNodeRoot): TrieNode;
export { createTrie, methods, methodsLowerCase };
export type { TrieNode, TrieNodeRoot, LeafBase, Method, MethodLowerCase, Middleware, MiddlewareCall, QueueIteamCall, QueueIteam, DelegatorMethods };
//# sourceMappingURL=trie.d.ts.map