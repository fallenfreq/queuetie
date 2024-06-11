import type { MiddlewareCall } from './trie.js';
declare const serveStatic: ({ filePath, staticDir, browserCache, serverCache }: {
    filePath?: string;
    staticDir?: string;
    browserCache?: boolean;
    serverCache?: boolean;
}) => MiddlewareCall;
export default serveStatic;
//# sourceMappingURL=static.d.ts.map