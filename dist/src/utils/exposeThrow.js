import {} from '../response.js';
const exposeThrow = function (arg1, arg2, arg3) {
    let { status, message, messages, error, props } = {
    // used to set types only
    };
    if (typeof arg1 === 'number')
        status = arg1;
    else if (arg1 instanceof Error)
        error = arg1;
    else if (typeof arg1 === 'object')
        props = arg1;
    if (typeof arg2 === 'string')
        message = arg2;
    if (Array.isArray(arg2))
        messages = arg2;
    else if (arg2 instanceof Error)
        error = arg2;
    else if (typeof arg2 === 'object')
        props = arg2;
    if (arg3)
        props = arg3;
    props ||= {};
    messages ||= props.messages;
    message ||= props.message;
    if (messages) {
        message = messages.map((message) => message).join(', ');
    }
    const err = Object.assign(error || new Error(message), props);
    Error.captureStackTrace(err, this.throw);
    if (status)
        err.status = status;
    if (messages)
        err.messages = messages;
    err.expose = true;
    throw err;
};
export { exposeThrow };
