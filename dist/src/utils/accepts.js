import { mime } from './mimeType.js';
import quickSort from '../hardcodeModules/quickSort.js';
import { IncomingMessage } from 'http';
import {} from '../index.js';
const mimeVals = Object.values(mime);
const shortHand = (check) => mimeVals.find(val => val.includes(check));
const parse = (acceptsHeader) => acceptsHeader.map(val => {
    const sections = val.split(';');
    const accepted = sections[0];
    if (!accepted)
        throw Error(`Unexpected format of accepts header value "${val}"`);
    const prefString = sections.length > 1
        ? sections[sections.length - 1]
        : null;
    const preference = prefString
        ? Number(prefString.split('=')[1])
        : 1;
    return { accepted, preference };
});
// check for a match
const condition = (accepted, type) => {
    const full = shortHand(type);
    if (!full)
        throw Error(type + ' mime type needs to be added');
    const prefix = full.split('/')[0] + '/*';
    return accepted === full
        || accepted === prefix
        || accepted === '*/*';
};
const accepts = (headers) => (types) => {
    const acceptedTypes = headers.accept?.split(',');
    // returns true in the case that headers.accept is missing or empty
    // as that means the server should do what it thinks is best
    // if the loop runs through without finding a match, it returns false
    if (!acceptedTypes || !acceptedTypes[0])
        return true;
    const parsed = parse(acceptedTypes);
    const accepts = quickSort(parsed, val => val.preference, true);
    for (const { accepted } of accepts) {
        if (typeof types === 'string' && condition(accepted, types)) {
            return types;
        }
        else if (Array.isArray(types)) {
            for (const type of types) {
                if (condition(accepted, type))
                    return type;
            }
        }
    }
    return false;
};
export default accepts;
// const req = {
//   headers: {
//     'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
//   }
// }
// console.log(
//   'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//   accepts(req)(['signed-exchange', 'apng', 'html'])//?
// )
