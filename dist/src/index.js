import * as http from 'http';
import * as https from 'https';
import { errorHandler } from './errorHandler.js';
import { augmentReq } from './request.js';
import { augmentRes } from './response.js';
import middleware from './utils/middleware.js';
import servStatic from './utils/static.js';
import { parseBody } from './utils/parseBody.js';
import { createTrie, methods } from './utils/trie.js';
import router from './utils/router.js';
// Redirect from http default for use without a reverse proxy like nginx
const httpsServer = ({ httpsOptions = {}, httpPort = 5175, httpsRedirectPort = 5174, redirectStatus = 302 }) => {
    http.createServer((req, res) => {
        if (!req.headers.host || !req.url) {
            res.statusCode = 400;
            res.end('Bad Request');
            return;
        }
        // using 302 instead of 301 as it's for dev and I dont want it cached
        res.writeHead(redirectStatus, {
            Location: 'https://'
                + req.headers.host.split(':')[0]
                + ':' + httpsRedirectPort
                + req.url
        });
        res.end();
    }).listen({ port: httpPort });
    return https.createServer(httpsOptions);
};
const augmentServer = (serverOptions = { httpsRedirect: false }) => {
    const server = serverOptions.httpsRedirect
        ? httpsServer(serverOptions)
        : http.createServer();
    const originalListen = server.listen;
    const trie = createTrie();
    const augmentedServer = Object.assign(server, trie, {
        parseBody,
        locals: {},
        request: {},
        response: {},
        static: servStatic,
        listenAsync(...args) {
            return new Promise((resolve) => {
                const lastArg = args[args.length - 1];
                if (typeof lastArg !== 'function')
                    args.push(() => resolve(listener));
                else
                    args.push(() => { lastArg(); resolve(listener); });
                const listener = originalListen.bind(server)(...args);
            });
        }
    });
    augmentedServer.root = augmentedServer;
    return augmentedServer;
};
function assertIsValidMethod(method) {
    if (!method)
        throw Error(`Invalid method type "${method}"`);
    for (const validMethod of methods) {
        if (method === validMethod)
            return;
    }
    throw Error(`Invalid method type "${method}"`);
}
function hasInitProps(req) {
    assertIsValidMethod(req.method);
    return typeof req.headers.host === 'string' && typeof req.url === 'string';
}
const initServer = (server) => {
    // remove leading slashs from urls. I also have nginx doing this
    server.use(({ pathname, url, method }, res, next) => {
        if (/\S+\/$/.test(pathname) && method === 'GET') {
            const query = url.slice(pathname.length);
            res.status(301).redirect(pathname.slice(0, -1) + query);
        }
        else
            return next();
    });
    server.use(errorHandler);
    server.on('error', (err) => {
        console.log('centralised error handling:');
        let i = 0;
        let cause = err;
        do {
            console.log('Cause depth:', i, cause);
            i++;
        } while ((cause = cause.cause));
        if (err.exit)
            process.exit(1);
    });
    server.on('request', (req, res) => {
        if (!hasInitProps(req)) {
            res.statusCode = 400;
            res.end('Bad Request');
            return;
        }
        const augmentedReq = augmentReq(server, req);
        const augmentedRes = augmentRes(server, augmentedReq, res);
        middleware(augmentedReq, augmentedRes);
    });
    return server;
};
const createServer = (serverOptions) => {
    return initServer(augmentServer(serverOptions));
};
export { router as createRouter };
export default createServer;
