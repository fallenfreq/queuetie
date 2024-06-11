import { IncomingMessage } from 'http';
import { type ConfirmedReqProps } from '../index.js';
declare const accepts: (headers: (IncomingMessage & ConfirmedReqProps)['headers']) => (types: string | string[]) => string | boolean;
export default accepts;
//# sourceMappingURL=accepts.d.ts.map