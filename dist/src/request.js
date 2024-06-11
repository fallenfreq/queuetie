import accepts from './utils/accepts.js';
import { IncomingMessage } from 'http';
import {} from './utils/parseBody.js';
import { compileQuery } from './utils/compileQuery.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import type { checkAgainstSymbol, paramSymbol } from './utils/trie.js'
// export type { checkAgainstSymbol, paramSymbol}
const isAjax = (headers) => headers['x-requested-with'] === 'XMLHttpRequest';
// augment request
const augmentReq = (server, req) => {
    // URLSearchParams is a built in standard for handling query strings
    const url = new URL(req.url, `https://${req.headers.host}`);
    const { searchParams, pathname } = url;
    const xForwardedFor = req.headers['x-forwarded-for'] || '';
    const reqParams = {
        method: req.method,
        queryDot: compileQuery(searchParams),
        query: Object.fromEntries(searchParams),
        pathname,
        app: server,
        accepts: accepts(req.headers),
        isAjax: isAjax(req.headers),
        ip: !Array.isArray(xForwardedFor)
            && xForwardedFor.split(',').pop()
            || req.socket.remoteAddress,
        queueIndex: 0,
        queue: server.collect(pathname, req.method)
    };
    return Object.assign(req, reqParams, server.request);
};
export { augmentReq };
