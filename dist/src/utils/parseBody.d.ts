import type { MiddlewareCall } from './trie.js';
import type { JsonSerializable } from '../../types/types.js';
type Body = (Record<string, string> | JsonSerializable | string);
declare const parseBody: MiddlewareCall;
export { parseBody, type Body };
//# sourceMappingURL=parseBody.d.ts.map