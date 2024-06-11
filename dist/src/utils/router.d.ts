import type { MiddlewareCall, TrieNode } from './trie.js';
type RouterCall = MiddlewareCall & TrieNode;
declare const router: () => RouterCall;
export type { RouterCall };
export default router;
//# sourceMappingURL=router.d.ts.map