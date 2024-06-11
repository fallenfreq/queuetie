const maxPostSize = 1000000;
const contentType = {
    'application/x-www-form-urlencoded': body => Object.fromEntries(new URLSearchParams(body.toString())),
    'application/json': body => JSON.parse(body.toString()),
    'text/plain': body => body.toString()
};
const parse = async (headers, body, res) => {
    const contentHeader = headers['content-type'];
    if (!contentHeader)
        return res.throw(400, 'No content-type header');
    const [type] = contentHeader.split(';');
    if (!type)
        return null;
    const parser = contentType[type];
    try {
        if (parser)
            return parser(body);
        else
            return null;
    }
    catch (err) {
        return res.throw(400, 'content-type does not match provided content');
    }
};
const parseBody = (req, res, next) => {
    const { method } = req;
    if (method === 'POST'
        || method === 'PUT'
        || method === 'DELETE') {
        const { headers } = req;
        const contentLength = headers['content-length'];
        if (method === 'DELETE' && !contentLength)
            return next();
        if (!contentLength)
            return res.throw(411);
        const length = parseInt(contentLength);
        if (length > maxPostSize)
            res.throw(413);
        const body = Buffer.allocUnsafe(length);
        let i = 0;
        const onData = (chunk) => {
            if (i + chunk.length <= length) {
                body.fill(chunk, i);
                i += chunk.length;
            }
            else {
                req.destroy();
                res.throw(413);
            }
        };
        return new Promise((resolve, reject) => {
            req.on('data', onData);
            req.on('end', async () => {
                if (i !== length) {
                    res.throw(400, 'Data is shorter than expected');
                }
                try {
                    req.body = await parse(headers, body, res);
                    if (!req.body)
                        res.throw(400, 'content-type not supported');
                    resolve(next());
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    else
        return next();
};
export { parseBody };
