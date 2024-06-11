/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import * as http from 'http';
import * as https from 'https';
import { type AugmentedRequest } from './request.js';
import { type AugmentedResponse } from './response.js';
import { type Method, type MiddlewareCall, type TrieNodeRoot } from './utils/trie.js';
import router from './utils/router.js';
type HttpsServerOptions = https.ServerOptions<typeof http.IncomingMessage, typeof http.ServerResponse>;
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
});
type AugmentedServer = ReturnType<typeof augmentServer>;
declare const augmentServer: (serverOptions?: ServerOptions) => (https.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) & {
    paramMiddlewareCalls: Record<string, import("./utils/trie.js").Middleware[]>;
    middlewareCount: number;
    isRoot: true;
} & {
    all: (this: import("./utils/trie.js").TrieNode, path: string | string[], firstMiddleware: import("./utils/trie.js").Middleware, ...middlewareCall: import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
    inc: () => number;
    count: () => number;
    use: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
    collect: (pathname: string | string[], method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS", prefixSegments?: string[] | undefined) => import("./utils/trie.js").QueueIteam[];
    param: (this: import("./utils/trie.js").TrieNode, params: string | string[], ...middlewareCall: import("./utils/trie.js").Middleware[]) => void;
    route: {
        <S extends string>(str: S): S extends `${infer _}?${infer _}` ? import("./utils/trie.js").DelegatorMethods<{
            all: (this: import("./utils/trie.js").TrieNode, path: string | string[], firstMiddleware: import("./utils/trie.js").Middleware, ...middlewareCall: import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            inc: () => number;
            count: () => number;
            use: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            collect: (pathname: string | string[], method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS", prefixSegments?: string[] | undefined) => import("./utils/trie.js").QueueIteam[];
            param: (this: import("./utils/trie.js").TrieNode, params: string | string[], ...middlewareCall: import("./utils/trie.js").Middleware[]) => void;
            route: any;
            get: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            post: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            put: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            delete: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            options: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
        }> : import("./utils/trie.js").TrieNode;
        (this: import("./utils/trie.js").TrieNode, path: string): import("./utils/trie.js").TrieNode | import("./utils/trie.js").DelegatorMethods<{
            all: (this: import("./utils/trie.js").TrieNode, path: string | string[], firstMiddleware: import("./utils/trie.js").Middleware, ...middlewareCall: import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            inc: () => number;
            count: () => number;
            use: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            collect: (pathname: string | string[], method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS", prefixSegments?: string[] | undefined) => import("./utils/trie.js").QueueIteam[];
            param: (this: import("./utils/trie.js").TrieNode, params: string | string[], ...middlewareCall: import("./utils/trie.js").Middleware[]) => void;
            route: any;
            get: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            post: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            put: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            delete: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            options: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
        }>;
    };
    root: TrieNodeRoot;
} & {
    GET?: import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode;
    POST?: import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode;
    PUT?: import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode;
    DELETE?: import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode;
    OPTIONS?: import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode;
} & {
    get: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
    post: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
    put: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
    delete: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
    options: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
} & {
    children: Record<string, import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode> & {
        someUniqueKeycheckAgainstSymbol?: Record<string, import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode>;
        someUniqueKeyParamSymbol?: Record<string, import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode>;
    };
    middleware: Record<number, import("./utils/trie.js").QueueIteam>;
    match: boolean;
    segments: string[];
    isParam?: string;
    params?: string[];
    contains?: import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode;
} & {
    someUniqueKeycheckAgainstSymbol?: Record<string, import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode>;
    someUniqueKeyParamSymbol?: Record<string, import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode>;
} & {
    parseBody: MiddlewareCall;
    locals: {};
    request: {};
    response: {};
    static: ({ filePath, staticDir, browserCache, serverCache }: {
        filePath?: string;
        staticDir?: string;
        browserCache?: boolean;
        serverCache?: boolean;
    }) => MiddlewareCall;
    listenAsync(handle: any, listeningListener?: (() => void) | undefined): Promise<https.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>>;
};
type ConfirmedReqProps = {
    headers: {
        host: string;
    };
    url: string;
    method: Method;
};
declare const createServer: (serverOptions?: ServerOptions) => (https.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) & {
    paramMiddlewareCalls: Record<string, import("./utils/trie.js").Middleware[]>;
    middlewareCount: number;
    isRoot: true;
} & {
    all: (this: import("./utils/trie.js").TrieNode, path: string | string[], firstMiddleware: import("./utils/trie.js").Middleware, ...middlewareCall: import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
    inc: () => number;
    count: () => number;
    use: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
    collect: (pathname: string | string[], method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS", prefixSegments?: string[] | undefined) => import("./utils/trie.js").QueueIteam[];
    param: (this: import("./utils/trie.js").TrieNode, params: string | string[], ...middlewareCall: import("./utils/trie.js").Middleware[]) => void;
    route: {
        <S extends string>(str: S): S extends `${infer _}?${infer _}` ? import("./utils/trie.js").DelegatorMethods<{
            all: (this: import("./utils/trie.js").TrieNode, path: string | string[], firstMiddleware: import("./utils/trie.js").Middleware, ...middlewareCall: import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            inc: () => number;
            count: () => number;
            use: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            collect: (pathname: string | string[], method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS", prefixSegments?: string[] | undefined) => import("./utils/trie.js").QueueIteam[];
            param: (this: import("./utils/trie.js").TrieNode, params: string | string[], ...middlewareCall: import("./utils/trie.js").Middleware[]) => void;
            route: any;
            get: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            post: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            put: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            delete: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            options: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
        }> : import("./utils/trie.js").TrieNode;
        (this: import("./utils/trie.js").TrieNode, path: string): import("./utils/trie.js").TrieNode | import("./utils/trie.js").DelegatorMethods<{
            all: (this: import("./utils/trie.js").TrieNode, path: string | string[], firstMiddleware: import("./utils/trie.js").Middleware, ...middlewareCall: import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            inc: () => number;
            count: () => number;
            use: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            collect: (pathname: string | string[], method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS", prefixSegments?: string[] | undefined) => import("./utils/trie.js").QueueIteam[];
            param: (this: import("./utils/trie.js").TrieNode, params: string | string[], ...middlewareCall: import("./utils/trie.js").Middleware[]) => void;
            route: any;
            get: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            post: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            put: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            delete: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
            options: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
        }>;
    };
    root: TrieNodeRoot;
} & {
    GET?: import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode;
    POST?: import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode;
    PUT?: import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode;
    DELETE?: import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode;
    OPTIONS?: import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode;
} & {
    get: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
    post: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
    put: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
    delete: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
    options: <T extends (string | RegExp | (string | RegExp)[]) | import("./utils/trie.js").Middleware>(this: import("./utils/trie.js").TrieNode, path: T, ...middleware: T extends string | RegExp | (string | RegExp)[] ? [import("./utils/trie.js").Middleware, ...import("./utils/trie.js").Middleware[]] : import("./utils/trie.js").Middleware[]) => import("./utils/trie.js").TrieNode;
} & {
    children: Record<string, import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode> & {
        someUniqueKeycheckAgainstSymbol?: Record<string, import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode>;
        someUniqueKeyParamSymbol?: Record<string, import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode>;
    };
    middleware: Record<number, import("./utils/trie.js").QueueIteam>;
    match: boolean;
    segments: string[];
    isParam?: string;
    params?: string[];
    contains?: import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode;
} & {
    someUniqueKeycheckAgainstSymbol?: Record<string, import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode>;
    someUniqueKeyParamSymbol?: Record<string, import("./utils/trie.js").LeafBase | import("./utils/trie.js").TrieNode>;
} & {
    parseBody: MiddlewareCall;
    locals: {};
    request: {};
    response: {};
    static: ({ filePath, staticDir, browserCache, serverCache }: {
        filePath?: string;
        staticDir?: string;
        browserCache?: boolean;
        serverCache?: boolean;
    }) => MiddlewareCall;
    listenAsync(handle: any, listeningListener?: (() => void) | undefined): Promise<https.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>>;
};
export type { AugmentedServer, ConfirmedReqProps, AugmentedRequest, AugmentedResponse, MiddlewareCall };
export { router as createRouter };
export default createServer;
//# sourceMappingURL=index.d.ts.map