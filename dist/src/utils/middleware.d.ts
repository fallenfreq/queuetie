import type { AugmentedRequest } from '../request.js';
import type { AugmentedResponse } from '../response.js';
type Next = () => unknown | {
    done: true;
};
declare const init: (req: AugmentedRequest, res: AugmentedResponse) => Promise<{
    value: unknown;
    exhausted: boolean;
    done: boolean;
}>;
type QueueReport = ReturnType<typeof init>;
export type { QueueReport, Next };
export default init;
//# sourceMappingURL=middleware.d.ts.map