import path from 'path';
import fs from 'fs';
import { mime } from './mimeType.js';
import { Stream, Readable } from 'stream';
import { createCache } from '../hardcodeModules/fileCache.js';
const cache = createCache({
    limit: 100000,
    freeUp: 5000
});
// moves on to 404 not found on error
const onStream = (readable, next) => new Promise((resolve) => {
    readable.on('error', () => resolve(next()));
    readable.on('end', () => resolve(undefined));
});
// set headers
const setHeaders = (res, ext, browserCache) => {
    if (browserCache)
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Content-type', mime[ext] || 'text/plain');
    res.status(200);
};
const serveStatic = ({ filePath = undefined, staticDir = 'assests', browserCache = false, serverCache = false }) => {
    return function (req, res, next) {
        // pathname always starts with a /
        const pathname = decodeURI(filePath || req.pathname);
        const virtualPath = [...req.prefixSegments || [], ...this.segments].join('/');
        // check for extention
        const ext = path.extname(pathname);
        if (!ext)
            return next();
        // check if cached version
        const cachedFile = cache.get(pathname);
        if (serverCache && cachedFile) {
            const readable = new Stream.Readable();
            const streamAttempt = onStream(readable, next);
            setHeaders(res, ext, browserCache);
            readable.pipe(res);
            cachedFile.data
                .forEach((buffer) => readable.push(buffer));
            readable.push(null);
            return streamAttempt;
        }
        // check virtualPath is correct
        const prefixCorrect = pathname
            .match(new RegExp('^/?' + virtualPath + '([a-zA-Z0-9/\\s-_&,.]*)'));
        if (!prefixCorrect)
            return next();
        // remove virtualPath
        const pathWithoutPrefix = prefixCorrect[1];
        if (!pathWithoutPrefix)
            throw Error('Expected pathWithoutPrefix to be in position 1');
        const filename = path.basename(pathWithoutPrefix);
        // check for poison null bytes
        if (filename.indexOf('\0') !== -1) {
            return res.status(403).end('Please don\'t do that');
        }
        // whitelist files
        if (!/^[a-zA-Z0-9/\s-_&,]*\.[a-zA-Z]{2,4}(\.[a-zA-Z]{2,4})?/.test(filename)) {
            return res.status(400).end('Illegal character or formatting in filename');
        }
        // make an absolute path
        const rootDir = staticDir.startsWith('/')
            ? staticDir
            : path.join(process.cwd(), staticDir);
        const absPath = path.join(rootDir, pathWithoutPrefix);
        // prevent directory traversal
        if (!absPath.startsWith(rootDir)) {
            return res.status(403).end('Trying to sneak out of the root?');
        }
        const readable = fs.createReadStream(absPath);
        const streamAttempt = onStream(readable, next);
        cache.set(pathname, readable);
        // Stream file to user
        setHeaders(res, ext, browserCache);
        readable.pipe(res);
        return streamAttempt;
    };
};
export default serveStatic;
