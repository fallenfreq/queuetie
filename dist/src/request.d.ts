/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { AugmentedServer, ConfirmedReqProps } from './index.js';
import { IncomingMessage } from 'http';
import { type Body } from './utils/parseBody.js';
type AugmentedRequest = ReturnType<typeof augmentReq>;
declare const augmentReq: (server: AugmentedServer, req: IncomingMessage & ConfirmedReqProps) => IncomingMessage & ConfirmedReqProps & {
    method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS";
    queryDot: (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | any))[]))[]))[]))[]))[]))[]))[]))[]))[]))[]))[] | null;
    query: {
        [k: string]: string;
    };
    pathname: string;
    app: (import("https").Server<typeof IncomingMessage, typeof import("http").ServerResponse> | import("http").Server<typeof IncomingMessage, typeof import("http").ServerResponse>) & {
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
        root: import("./utils/trie.js").TrieNodeRoot;
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
        parseBody: import("./utils/trie.js").MiddlewareCall;
        locals: {};
        request: {};
        response: {};
        static: ({ filePath, staticDir, browserCache, serverCache }: {
            filePath?: string;
            staticDir?: string;
            browserCache?: boolean;
            serverCache?: boolean;
        }) => import("./utils/trie.js").MiddlewareCall;
        listenAsync(handle: any, listeningListener?: (() => void) | undefined): Promise<import("https").Server<typeof IncomingMessage, typeof import("http").ServerResponse> | import("http").Server<typeof IncomingMessage, typeof import("http").ServerResponse>>;
    };
    accepts: (types: string | string[]) => string | boolean;
    isAjax: boolean;
    ip: string | undefined;
    queueIndex: number;
    queue: import("./utils/trie.js").QueueIteam[];
} & {
    prefixSegments?: string[];
    body?: Body;
    params?: Record<string, string>;
    paramKey?: string;
};
export { augmentReq };
export type { AugmentedRequest };
//# sourceMappingURL=request.d.ts.map