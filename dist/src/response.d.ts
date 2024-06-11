/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { AugmentedServer } from './index.js';
import type { AugmentedRequest } from './request.js';
import { ServerResponse } from 'http';
import type { JsonSerializable } from '../types/types.js';
declare const augmentRes: (server: AugmentedServer, req: AugmentedRequest, res: ServerResponse) => ServerResponse<import("http").IncomingMessage> & {
    req: import("http").IncomingMessage & import("./index.js").ConfirmedReqProps & {
        method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS";
        queryDot: (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | (string | number | (import("./utils/compileQuery.js").ParamDataObject | any))[]))[]))[]))[]))[]))[]))[]))[]))[]))[]))[] | null;
        query: {
            [k: string]: string;
        };
        pathname: string;
        app: (import("https").Server<typeof import("http").IncomingMessage, typeof ServerResponse> | import("http").Server<typeof import("http").IncomingMessage, typeof ServerResponse>) & {
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
            listenAsync(handle: any, listeningListener?: (() => void) | undefined): Promise<import("https").Server<typeof import("http").IncomingMessage, typeof ServerResponse> | import("http").Server<typeof import("http").IncomingMessage, typeof ServerResponse>>;
        };
        accepts: (types: string | string[]) => string | boolean;
        isAjax: boolean;
        ip: string | undefined;
        queueIndex: number;
        queue: import("./utils/trie.js").QueueIteam[];
    } & {
        prefixSegments?: string[];
        body?: import("./utils/parseBody.js").Body;
        params?: Record<string, string>;
        paramKey?: string;
    };
    locals: {};
    throw: {
        (status?: number | undefined, message?: string | undefined, properties?: {
            [k: string]: unknown;
            messages?: never;
            message?: never;
            status?: number;
            expose?: boolean;
            exit?: boolean;
            cause?: import("./utils/exposeThrow.js").ServerError;
            handler?: (message: string) => unknown;
        } | undefined): never;
        (status?: number | undefined, messages?: string[] | undefined, properties?: {
            [k: string]: unknown;
            messages?: never;
            message?: never;
            status?: number;
            expose?: boolean;
            exit?: boolean;
            cause?: import("./utils/exposeThrow.js").ServerError;
            handler?: (message: string) => unknown;
        } | undefined): never;
        (status: number | undefined, error: Error, properties?: {
            [k: string]: unknown;
            messages?: never;
            message?: never;
            status?: number;
            expose?: boolean;
            exit?: boolean;
            cause?: import("./utils/exposeThrow.js").ServerError;
            handler?: (message: string) => unknown;
        } | undefined): never;
        (error: Error, properties?: {
            [k: string]: unknown;
            messages?: never;
            message?: never;
            status?: number;
            expose?: boolean;
            exit?: boolean;
            cause?: import("./utils/exposeThrow.js").ServerError;
            handler?: (message: string) => unknown;
        } | undefined): never;
        (properties?: {
            [x: string]: unknown;
            messages?: string[];
            message?: string;
            status?: number;
            expose?: boolean;
            exit?: boolean;
            cause?: import("./utils/exposeThrow.js").ServerError;
            handler?: (message: string) => unknown;
        } | undefined): never;
    };
    render: ((path: string, options: Record<string, unknown>) => unknown) | undefined;
    status(status: number): ServerResponse<import("http").IncomingMessage> & any;
    json(object: JsonSerializable): void;
    redirect(redirectPath: string | undefined): void;
};
type AugmentedResponse = ReturnType<typeof augmentRes>;
export { augmentRes, type AugmentedResponse };
//# sourceMappingURL=response.d.ts.map