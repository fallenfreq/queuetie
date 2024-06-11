const init = async (req, res) => {
    let i = 0;
    const next = () => {
        const { value, done } = it.next();
        req.queueIndex = i++;
        if (done)
            return { done };
        else
            return value._call(req, res, next);
    };
    const gen = function* () {
        yield* req.queue;
    };
    const it = gen();
    const lastResult = await next();
    const done = typeof lastResult === 'object'
        && lastResult !== null
        && 'done' in lastResult
        && lastResult.done
        ? true : false;
    return {
        value: lastResult,
        exhausted: req.queueIndex === req.queue.length,
        done
    };
};
export default init;
// must await in async functions or return next - similar to koa
// use try catch block at the top to catch errors
// const queue:MiddlewareCall[] = [
//   async (req, res, next:Next) => {
//     try {
//       const lastResult = await next()
//       if (req.queueIndex === req.queue.length) {
//         console.log('queue compleated')
//       } else console.log('queue returned early')
//       return lastResult
//     } catch (err) {
//       console.log('err log: ', err)
//       return next()
//     }
//   },
//   (req, res, next) => {
//     return next()
//   },
//   async (req, res, next) => {
//     return next()
//   },
//   // async (req, res, next) => {
//   //   throw 'some error'
//   // },
//   async (req, res, next) => {
//     const result = await next()
//     return result
//   }
// ]
// const req = {
//   queue:queue.map(_call => ({_call})) 
// } as AugmentedRequest
// const res = {} as AugmentedResponse
// init(req, res).then((report:Awaited<QueueReport>) => {
//   console.log({report})
// })
